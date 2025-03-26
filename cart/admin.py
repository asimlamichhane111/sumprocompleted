from django.contrib import admin
from .models import Cart

class CartAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = ('user', 'product', 'quantity', 'total_price')
    
    # Filters for the list view
    list_filter = ('user', 'product')
    
    # Search functionality
    search_fields = ('user__username', 'product__name')
    
    # Read-only fields (e.g., calculated fields)
    readonly_fields = ('total_price',)
    
    # Custom method to display total price in the admin
    def total_price(self, obj):
        return obj.total_price()
    total_price.short_description = 'Total Price'  # Column header in the admin list view

# Register the Cart model with the admin site
admin.site.register(Cart, CartAdmin)
