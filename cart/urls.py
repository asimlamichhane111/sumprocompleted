from django.urls import path
from .views import CartView, RemoveFromCartView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('<int:cart_id>/', RemoveFromCartView.as_view(), name='remove_from_cart'),

]
