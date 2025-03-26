import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "./CartContext";
import "./Navbar.css";
import myImage from "/images/logo-for-store.jpeg";

const Navbar = () => {
  const { isAuthenticated, logout ,user} = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  console.log("Auth Status:",isAuthenticated);

  return (
    <nav className="nav">
        <Link to="/home" className="logo">
        <img src={myImage} alt="Store Logo" style={{ maxHeight: "80px"}}/>
        </Link>
        
        <ul className="nav-links">
          {isAuthenticated ? (
            <>
              <li><Link to="/home">Home</Link></li>
              {user?.role==="customer"&&(
                <>
                  <li><Link to="/products">All Products</Link></li>
                  <li><Link to="/products/Beer">Beer</Link></li>
                  <li><Link to="/products/Vodka">Vodka</Link></li>
                  <li><Link to="/products/Whisky">Whisky</Link></li>
                  <li><Link to="/products/Rum">Rum</Link></li>
                  <li><Link to="/order-history">Order History</Link></li>
                  <li>
                    <Link to="/cart" className="cart-link">
                      Cart <span className="cart-count">{cart.length}</span>
                    </Link>
                  </li>
                </>
                )}
              {user?.role === "owner" && (
                <>
                  <Link to="/owner/dashboard">Dashboard</Link>
                  <Link to="/owner/products">Products</Link>
                  <Link to="/owner/sales-analytics">Sales Analytics</Link>
                </>
              )}
              <li><button className="logout-btn" onClick={logout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
    </nav>
  );
};

export default Navbar;
