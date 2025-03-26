from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import  add_to_inventory, low_stock_products, product_list, update_product

def inventory_home(request):
    from django.http import JsonResponse
    return JsonResponse({"message": "Welcome to Inventory API!"})
urlpatterns=[
    path('', inventory_home, name='inventory_home'),
    path('api/products/',product_list,name='product-list'),
    path('api/low-stock/',low_stock_products,name='low-stock-products'),
    path('api/products/<int:product_id>/add_to_inventory/', add_to_inventory, name='add_to_inventory'),
    path('api/products/<int:product_id>/', update_product, name='update-product'),


]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

