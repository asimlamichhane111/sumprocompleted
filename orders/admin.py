from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'customer_phone','order_date', 'status', 'total_price',)#'assigned_to'
    list_filter = ('status',)#'assigned_to'
    search_fields = ('customer_name','customer_phone',)
    inlines = [OrderItemInline]

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
