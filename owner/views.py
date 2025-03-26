from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from inventory.models import Product
from orders.models import Order
from .serializers import OrderSerializer, ProductSerializer, OwnerSerializer
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.db.models import Sum
from django.db.models.functions import TruncMonth
import matplotlib.pyplot as plt
import io
import base64
from datetime import timedelta
from django.utils import timezone

# Owner Dashboard API
class OwnerDashboardView(APIView):
    permission_classes=[IsAuthenticated,IsAdminUser]
    def get(self, request):
        # Check if the user is authenticated and is a staff member
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        total_sales = sum(order.total_price for order in Order.objects.all())       
        total_orders=Order.objects.count()
        top_products=Product.objects.order_by('-quantity_sold')[:3]
        top_product_names = [product.name for product in top_products]

        products = Product.objects.all()
        product_data = [
            {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "quantity": product.quantity,
                "quantity_sold": product.quantity_sold,
            }
            for product in products
        ]

        # Example data for the dashboard
        data = {
            "total_sales": total_sales,
            "total_orders": total_orders,
            "top_products": top_product_names,
            "products": product_data,  # Include actual product data
        }

        return Response(data, status=status.HTTP_200_OK)


# Sales Analytics API
class SalesAnalyticsView(APIView):
    permission_classes=[IsAuthenticated,IsAdminUser]
    def get(self, request):
        # Check if the user is authenticated and is a staff member
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Example sales data
        sales_data =self.get_sales_data()
        chart = self.generate_sales_chart(sales_data)
        return Response({"chart": chart}, status=status.HTTP_200_OK)
    def get_sales_data(self):
        end_date=timezone.now()
        start_date=end_date-timedelta(days=30)

        monthly_sales = (
            Order.objects
            .filter(order_date__range=[start_date, end_date])
            .annotate(month=TruncMonth('order_date'))
            .values('month')
            .annotate(total_sales=Sum('total_price'))
            .order_by('month')
        )
        sales_data = {sale['month'].strftime('%B'): sale['total_sales'] for sale in monthly_sales}
        return sales_data

    def generate_sales_chart(self, sales_data):
        # Generate a bar chart for sales data
        plt.figure(figsize=(4, 3))
        plt.bar(sales_data.keys(), sales_data.values())
        plt.xlabel('Month')
        plt.ylabel('Sales (Rs)')
        plt.title('Monthly Sales')
        plt.xticks(rotation=45)

        # Save the chart to a buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        plt.close()

        # Encode the chart as base64
        chart_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return chart_base64


# Product Create API
class ProductCreateView(APIView):
    def post(self, request):
        # Check if the user is authenticated and is a staff member
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Validate and save the product
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Order List API
class OrderListView(APIView):
    def get(self, request):
        # Check if the user is authenticated and is a staff member
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Fetch and serialize all orders
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)