import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

export const CartContext = createContext();

export function useCart(){
    return useContext(CartContext);
}

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);
    useEffect(()=>{
        localStorage.setItem("cart",JSON.stringify(cart));
    },[cart]);

    const fetchCart = async () => {
        try {
            const token=localStorage.getItem("access_token");
            console.log("Token being sent:",token);
            if(!token){
                console.error("No access token found");
                return;
            }
            const response = await axiosInstance.get("http://127.0.0.1:8000/cart/", {
                headers: {
                     Authorization: `Bearer ${token}`,
                    "Content-Type":"application/json",
                },
            });
            console.log("cart Data:",JSON.stringify(response.data));
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart", error.response?.data||error);
        }
    };

    const addToCart = async (productId, quantity=1) => {
        try {
            const token = localStorage.getItem("access_token");
            quantity=parseInt(quantity,10);
            const existingItem = cart.find((item) => item.product.id === productId);
            console.log("Adding to cart:", { product: productId, quantity });

            if (existingItem) {
                const updatedQuantity = existingItem.quantity + 1;
                await axiosInstance.patch(
                    `/cart/${existingItem.id}/`,
                    { quantity: updatedQuantity },
                    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                );
            } else {
                await axiosInstance.post(
                    "/cart/",
                    { product: productId, quantity: quantity},
                    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                );
            }

            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart", error);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            const token = localStorage.getItem("access_token");
            await axiosInstance.delete(`/cart/${cartId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCart((prevCart) => prevCart.filter((item) => item.id !== cartId));
        } catch (error) {
            console.error("Error removing from cart", error);
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const price = item.product?.price || item.price || 0;
            return total + item.quantity * parseFloat(price);
        }, 0).toFixed(2);
    };

    return (
        <CartContext.Provider value={{ cart,setCart, addToCart, removeFromCart ,getTotalPrice}}>
            {children}
        </CartContext.Provider>
    );
};
