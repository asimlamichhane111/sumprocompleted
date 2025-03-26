from django.http import HttpResponse
from reportlab.pdfgen import canvas
from io import BytesIO
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from orders.models import Order
from .serializers import OrderSerializer
from datetime import  timedelta
from django.utils import timezone
import matplotlib
import io
import base64

matplotlib.use('Agg')
import matplotlib.pyplot as plt
# Function to generate a PDF receipt
def generate_receipt(order):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer)

    # Add content to the PDF
    pdf.drawString(100, 800, f"Receipt for Order #{order.id}")
    pdf.drawString(100, 780, f"Customer: {order.customer_name}")
    pdf.drawString(100, 760, f"Order Date: {order.order_date}")

    y = 740
    pdf.drawString(100, y, "Items:")
    y -= 20

    for item in order.items.all():
        pdf.drawString(120, y, f"{item.quantity} x {item.product.name} - Rs{item.total_price}")
        y -= 20

    pdf.drawString(100, y - 20, f"Total Price: Rs{order.total_price}")
    pdf.save()

    buffer.seek(0)
    return buffer

# View to download a receipt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_receipt(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
        buffer = generate_receipt(order)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="receipt_{order.id}.pdf"'
        return response
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

# View to fetch order history
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def order_history(request):
    orders = Order.objects.filter(user=request.user).order_by('-order_date')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

# View to generate sales analytics
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_analytics(request):
    # Get the time period (e.g., last 30 days)
    end_date = timezone.now()
    start_date = end_date - timedelta(days=30)

    # Fetch orders within the time period
    orders = Order.objects.filter(order_date__range=[start_date, end_date])

    # Calculate daily sales
    daily_sales = {}
    for order in orders:
        date = order.order_date.strftime('%Y-%m-%d')
        if date in daily_sales:
            daily_sales[date] += order.total_price
        else:
            daily_sales[date] = order.total_price

    # Generate a bar chart
    dates = list(daily_sales.keys())
    sales = list(daily_sales.values())

    plt.figure(figsize=(10, 6))
    plt.bar(dates, sales)
    plt.xlabel('Date')
    plt.ylabel('Sales (Rs)')
    plt.title('Sales Over the Last 30 Days')
    plt.xticks(rotation=45)

    # Save the chart to a buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png')
    buffer.seek(0)
    plt.close()

    # Encode the chart as base64
    chart_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return Response({"chart": chart_base64})