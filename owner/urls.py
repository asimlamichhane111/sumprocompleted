from django.urls import path
from .views import OwnerDashboardView, OrderListView, ProductCreateView, SalesAnalyticsView

urlpatterns = [
    path('dashboard/', OwnerDashboardView.as_view(), name='owner_dashboard'),
    path('orders/', OrderListView.as_view(), name='owner_orders'),
    path('sales-analytics/', SalesAnalyticsView.as_view(), name='sales_analytics'),
    path('product/add/', ProductCreateView.as_view(), name='add_product'),
]