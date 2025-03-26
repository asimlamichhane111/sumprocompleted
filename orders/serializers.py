from rest_framework import serializers
from .models import Order, OrderItem
from users.models import UserProfile

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.FloatField(source='product.price', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'product_price', 'quantity', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    customer_phone=serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'customer_name', 'order_date', 'status', 'items', 'total_price','customer_phone']

    def get_total_price(self, obj):
        return obj.total_price
    
    def get_customer_phone(self, obj):
        user_profile = UserProfile.objects.get(user=obj.user.id)
        return user_profile.phone
