from django.db import models
from django.contrib.auth.models import User
from inventory.models import Product  # Import your Product model
from django.utils import timezone

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True,blank=True)  # Link to logged-in user
    # assigned_to=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name='assigned_orders')
    customer_name = models.CharField(max_length=255)
    customer_phone=models.CharField(max_length=15,blank=True,null=True)
    order_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    @property
    def total_price(self):
        return sum(item.total_price for item in self.items.all())

    def __str__(self):
        return f"Order {self.id} - {self.customer_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("inventory.Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    @property
    def total_price(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product.name} for Order {self.order.id}"
