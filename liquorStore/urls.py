"""
URL configuration for liquorStore project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

admin.site.site_header = "Welcome Liquor Store admin"
admin.site.site_title = "Welcome liquor store"
admin.site.index_title = "Welcome liquor store"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('orders.urls')),
    path('inventory/',include('inventory.urls')),
    path('billing/',include('billing.urls')),
    path('cart/', include('cart.urls')),
    path('users/',include('users.urls')),
    path('owner/',include('owner.urls')),

    #for refreshing token
    path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api/token/refresh/',TokenRefreshView.as_view,name='token_refresh'),
]
