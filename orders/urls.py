from django.urls import path
from .views import  orders_view
from django.conf import settings
from django.conf.urls.static import static
urlpatterns=[
    path('api/orders/',orders_view,name='orders_view'),
path('api/orders/<int:orderId>/', orders_view, name='update-order-status'),
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)