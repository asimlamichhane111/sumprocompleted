import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartContext";
import {useOrder} from "../components/OrderContext"
import '../components/ProductCard.css';


const Cart = () => {
  const{cart,removeFromCart,getTotalPrice}=useCart();
  const {placeOrder}=useOrder();
  const[phoneNumber,setPhoneNumber]=useState("");

  const handlePlaceOrder = () => {
    if (!phoneNumber) {
        alert("Please enter your phone number.");
        return;
    }
    placeOrder(cart, phoneNumber);
};

  useEffect(() => {
    console.log("Image URL:", cart.map((item) => item.image));
  }, [cart]);

  if (!cart || cart.length === 0) {
    return (
      <>
      <Navbar/> 
      <p>Your cart is empty</p>
      </>
      );
  }

  return (
    <div>
      <Navbar/>
      <h2>Your Cart</h2>
      <div className="product-grid">
      {cart.map((item) => (
        <div key={item.id} className="product-card">
          <img className="product-image" src={item.image} alt={item.name}></img>
          <p className="product-name">{item.product_name} </p>
          <p className="product-price"> {item.quantity} x Rs{item.price}</p>
          <button className="add-to-cart" onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
    <div className="cart-total">
        <h3>Total Price: Rs {getTotalPrice()}</h3>
      </div>
      <div>
                <label htmlFor="phone">Phone Number:</label>
                <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                />
            </div>
      <button onClick={handlePlaceOrder} style={{ backgroundColor: "green", color: "white", padding: "10px", marginTop: "20px" }}>
        Place Order
      </button>
    </div>
  );
};

export default Cart;

  