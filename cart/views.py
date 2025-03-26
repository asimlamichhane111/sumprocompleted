from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework import status
from .models import Cart
from .serializers import CartSerializer
from rest_framework import status
from inventory.models import Product

class CartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart_items = Cart.objects.filter(user=request.user)  # Get the user's cart items
        serializer = CartSerializer(cart_items, many=True,context={'request':request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data=request.data.copy()
        product_id=data.get("product")

        print("Received Product ID:",product_id)
        if not product_id:
            return Response({"error":"Product ID is required"},status=400)
        
        product=Product.objects.filter(id=product_id).first()
        if not product:
            return Response({"error":f"Product ID {product_id} not found"},status=404)
        existing_cart_item = Cart.objects.filter(user=request.user, product_id=product_id).first()

        if existing_cart_item:
            existing_cart_item.quantity += 1
            existing_cart_item.save()
            serializer = CartSerializer(existing_cart_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
        data["user"] = request.user.id  # Ensure the user is set
        serializer = CartSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
class RemoveFromCartView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, cart_id):
        try:
            cart_item = Cart.objects.get(id=cart_id, user=request.user)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=200)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=404)
