from django.urls import path
from .views import download_receipt, order_history, sales_analytics

urlpatterns = [
    path('api/receipt/<int:order_id>/', download_receipt, name='download_receipt'),
    path('api/order-history/', order_history, name='order_history'),
    path('api/sales-analytics/', sales_analytics, name='sales_analytics'),
]