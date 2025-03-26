# from django.http import JsonResponse
# from rest_framework.response import Response
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import IsAuthenticated
# from .models import Order, OrderItem
# from .serializers import OrderSerializer
# from inventory.models import Product
# from cart.models import Cart
# from django.db import transaction

# @api_view(['GET','POST','PATCH'])
# @permission_classes([IsAuthenticated])
# def orders_view(request):
#     if request.method == 'GET':
#         if request.user.is_staff:
#             orders=Order.objects.all()
#             print(f"Fetching orders assigned to owner: {request.user.username}")
#         else:
#             orders = Order.objects.filter(user=request.user)
#             print(f"Fetching orders for customer: {request.user.username}")

#         print(f"Orders found: {orders.count()}")
#         serializer = OrderSerializer(orders, many=True)
#         return Response({'orders': serializer.data}, status=200)
    
#     data = request.data
#     print("Received Order Data:", data)  # Debugging line

#     if not isinstance(data, dict) or 'items' not in data or not isinstance(data['items'], list):
#         print(" Invalid order data format:", data)
#         return Response({'error': 'Invalid order data'}, status=400)
    
#     cart_items = Cart.objects.filter(user=request.user)

#     if not cart_items.exists():
#         return JsonResponse({"error": "Cart is empty"}, status=400)
    
#     customer_phone=data.get('phone')
#     if not customer_phone:
#         return Response({'error': 'Customer phone is required'}, status=400)
    
#     with transaction.atomic():
#             order = Order.objects.create(
#                 user=request.user, 
#                 customer_name=request.user.username,
#                 customer_phone=customer_phone,
#                 # assigned_to=request.user if request.user.is_staff else None
#                 )
    
#     for item in data['items']:
#         product_id=item.get('product')
#         quantity = item.get('quantity', 1)
#         print(f"Checking Product ID:{product_id}")
#         try:
#             product = Product.objects.get(id=product_id)
#             if product.quantity<quantity:
#                 return Response({'error':f'Not enough stock for {product.name}'},status=400)
            
#             product.quantity-=quantity
#             product.save()
            
#             OrderItem.objects.create(order=order, product=product, quantity=quantity)
#         except Product.DoesNotExist:
#             print(f"Product with id{product_id} does not exist")
#             return Response({'error': 'Product not found'}, status=404)
        
#     cart_items.delete()

#     serializer=OrderSerializer(order)
#     return Response({
#         'messege':'Order placed successfully',
#         'order':serializer.data,
#     },status=201)
# elif request.method == 'PATCH':
#         # Handle order status updates
#         if not request.user.is_staff:
#             return Response({"error": "Only staff members can update order status."}, status=403)

#         try:
#             order = Order.objects.get(id=orderId)
#             new_status = request.data.get('status')

#             if new_status not in ['pending', 'completed', 'cancelled']:  # Add other valid statuses if needed
#                 return Response({"error": "Invalid status."}, status=400)

#             order.status = new_status
#             order.save()

#             serializer = OrderSerializer(order)
#             return Response({
#                 "message": f"Order status updated to {new_status}.",
#                 "order": serializer.data,
#             }, status=200)
#         except Order.DoesNotExist:
#             return Response({"error": "Order not found."}, status=404)
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from .serializers import OrderSerializer
from inventory.models import Product
from cart.models import Cart
from django.db import transaction

@api_view(['GET', 'POST', 'PATCH'])
@permission_classes([IsAuthenticated])
def orders_view(request, orderId=None):  # Add orderId as an optional parameter
    if request.method == 'GET':
        # Fetch orders for the logged-in user
        if request.user.is_staff:
            orders = Order.objects.all()
            print(f"Fetching orders assigned to owner: {request.user.username}")
        else:
            orders = Order.objects.filter(user=request.user)
            print(f"Fetching orders for customer: {request.user.username}")

        print(f"Orders found: {orders.count()}")
        serializer = OrderSerializer(orders, many=True)
        return Response({'orders': serializer.data}, status=200)

    elif request.method == 'POST':
        # Handle order creation
        data = request.data
        print("Received Order Data:", data)  # Debugging line

        if not isinstance(data, dict) or 'items' not in data or not isinstance(data['items'], list):
            print("Invalid order data format:", data)
            return Response({'error': 'Invalid order data'}, status=400)

        cart_items = Cart.objects.filter(user=request.user)

        if not cart_items.exists():
            return JsonResponse({"error": "Cart is empty"}, status=400)

        customer_phone = data.get('phone')
        if not customer_phone:
            return Response({'error': 'Customer phone is required'}, status=400)

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                customer_name=request.user.username,
                customer_phone=customer_phone,
                status='pending',  # Default status when creating an order
            )

            for item in data['items']:
                product_id = item.get('product')
                quantity = item.get('quantity', 1)
                print(f"Checking Product ID:{product_id}")
                try:
                    product = Product.objects.get(id=product_id)
                    if product.quantity < quantity:
                        return Response({'error': f'Not enough stock for {product.name}'}, status=400)

                    product.quantity -= quantity
                    product.save()

                    OrderItem.objects.create(order=order, product=product, quantity=quantity)
                except Product.DoesNotExist:
                    print(f"Product with id {product_id} does not exist")
                    return Response({'error': 'Product not found'}, status=404)

            cart_items.delete()

        serializer = OrderSerializer(order)
        return Response({
            'message': 'Order placed successfully',
            'order': serializer.data,
        }, status=201)

    elif request.method == 'PATCH':
        # Handle order status updates
        if not request.user.is_staff:
            return Response({"error": "Only staff members can update order status."}, status=403)

        try:
            order = Order.objects.get(id=orderId)
            new_status = request.data.get('status')

            if new_status not in ['pending', 'completed', 'cancelled','accepted','rejected']:  # Add other valid statuses if needed
                return Response({"error": "Invalid status."}, status=400)

            order.status = new_status
            order.save()

            serializer = OrderSerializer(order)
            return Response({
                "message": f"Order status updated to {new_status}.",
                "order": serializer.data,
            }, status=200)
        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=404)