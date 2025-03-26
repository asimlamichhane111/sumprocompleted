import React, { useEffect, useState } from "react";
import { fetchOrderHistory } from "../api/billing";
import OrderItem from "../components/OrderItem";
import Navbar from "../components/Navbar";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const loadOrderHistory = async () => {
            try {
                const data = await fetchOrderHistory();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching order history:", error);
            }
        };

        loadOrderHistory();
    }, []);

    return (
        <div>
            <Navbar/>
            <h1>Order History</h1>
            {orders.map((order) => (
                <OrderItem key={order.id} order={order} />
            ))}
        </div>
    );
};

export default OrderHistory;