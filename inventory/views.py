from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product_list(request):
    category=request.GET.get("category")
    if category:
        products=Product.objects.filter(category__name=category)
    else:
        products=Product.objects.all()
    serializer=ProductSerializer(products,many=True)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def low_stock_products(request):
    low_stock_threshold = 5  
    low_stock_items = Product.objects.filter(quantity__lt=low_stock_threshold)  
    
    serializer = ProductSerializer(low_stock_items, many=True)
    return Response(serializer.data)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_inventory(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        # Increment the stock quantity
        product.quantity += 1
        product.save()
        return Response({"message": "Product added to inventory successfully!"}, status=200)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)