from rest_framework import serializers
from .models import Owner
from orders.models import Order
from inventory.models import Product

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = ['id', 'user', 'phone_number', 'address']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['id', 'user', 'customer_name', 'order_date', 'status', 'total_price']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'quantity', 'category']
    