from django.urls import path
from .views import  login, register_user
urlpatterns=[
    path('api/login/',login,name='login'),
    path('api/register/',register_user,name='register-user'),
]