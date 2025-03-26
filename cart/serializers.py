from rest_framework import serializers
from .models import Cart
from inventory.models import Product

class CartSerializer(serializers.ModelSerializer):
    product=serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_name = serializers.CharField(source='product.name',read_only=True)
    price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)  
    total_price = serializers.SerializerMethodField()
    image = serializers.ImageField(source='product.image',read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "product", "product_name", "quantity", "price", "total_price","image"]
    def get_total_price(self, obj):
        """Calculate total price using latest product price"""
        return obj.total_price()
    def create(self, validated_data):
        """Override create to ensure user is set from request"""
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
        return super().create(validated_data)
    def to_representation(self, instance):
        request = self.context.get('request')
        representation = super().to_representation(instance)

        # Ensure the image field is properly populated with an absolute URL
        if instance.product.image:
            image_url = f"/inventory{instance.product.image.url}"
            if request is not None:
                image_url = request.build_absolute_uri(image_url)  # Build full URL
            representation['image'] = image_url  # Set the correct image URL
        
        return representation
