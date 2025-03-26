from django.db import models

class Category(models.Model):
    name=models.CharField(max_length=50,unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name=models.CharField(max_length=255)
    category=models.ForeignKey(Category,on_delete=models.CASCADE,null=True,blank=True)
    price=models.DecimalField(max_digits=10,decimal_places=2)
    quantity=models.IntegerField()
    low_stock_threshold=models.IntegerField(default=5)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    quantity_sold=models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} - {self.quantity} in stock"
    
    def is_low_stock(self):
        return self.quantity<= self.low_stock_threshold