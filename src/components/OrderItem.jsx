import React from "react";
import { downloadReceipt } from "../api/billing";

const OrderItem = ({ order }) => {
    const handleDownloadReceipt = async (orderId) => {
        try {
            const receiptBlob = await downloadReceipt(orderId);
            const url = window.URL.createObjectURL(new Blob([receiptBlob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `receipt_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error downloading receipt:", error);
        }
    };

    return (
        <div>
            <h3>Order #{order.id}</h3>
            <p>Date: {order.order_date}</p>
            <p>Total: Rs{order.total_price}</p>
            <button onClick={() => handleDownloadReceipt(order.id)}>Download Receipt</button>
        </div>
    );
};

export default OrderItem;