import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useOrder } from "../components/OrderContext";
import { useCart } from "../components/CartContext";

const Orders = () => {
    const { orders, loading, error, message, fetchOrders, placeOrder } = useOrder();
    const { cart } = useCart();

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePlaceOrder = () => {
        if (cart.length === 0) {
            alert("Your cart is empty! Add items before placing an order.");
            return;
        }
        placeOrder(cart);
    };

    return (
        <div>
            <Navbar />
            <h2>Your Orders</h2>

            {loading && <p>Loading orders...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <button onClick={handlePlaceOrder} className="add-to-cart">Place Order</button>

            {orders.length === 0 ? (
                <p>You have no orders yet.</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <strong>Order #{order.id}</strong> - {order.customer_name}
                            <ul>
                                {order.items.map((item) => (
                                    <li key={item.id}>
                                        {item.product_name} - {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Orders;
