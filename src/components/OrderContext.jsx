import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useCart } from "./CartContext";

export const OrderContext = createContext();

export function useOrder(){
    return useContext(OrderContext);
}

export const OrderProvider = ({ children }) => {
    const { user } = useAuth();
    const{setCart}=useCart();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("No access token found");
                return;
            }

            setLoading(true);
            const response = await axiosInstance.get("/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data || "Error fetching orders");
            setLoading(false);
        }
    };

    const placeOrder = async (cart,phoneNumber) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                console.error("No access token found");
                return;
            }
            console.log("Cart contents before placing order:", cart);

            
            const orderData = {
                
                items: cart.map((item) => ({
                    product: item.product,
                    quantity: item.quantity>0?item.quantity:1,
                })),
                phone:phoneNumber,
            };

            const response = await axiosInstance.post("/api/orders/", orderData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            
            setCart([]);
            localStorage.removeItem("cart");
            
            alert("Order has been placed successfully");
            if(response.data.receipt_url){
                window.open(response.data.receipt_url, "_blank");
            }
            setMessage(response.data.message);
            fetchOrders(); // Refresh orders after placing one
            
            
        } catch (error) {
            alert(error.response?.data?.error || "Error placing order");
            setError(error.response?.data || "Error placing order");
        }
    };

    return (
        <OrderContext.Provider value={{ orders, loading, error, message, fetchOrders, placeOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
export default OrderProvider;


