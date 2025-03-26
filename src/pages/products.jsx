import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import '../components/ProductCard.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery,setSearchQuery]=useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const token=localStorage.getItem("token");
        axios.get("http://127.0.0.1:8000/inventory/api/products/",{
            headers:{
                Authorization:`Bearer ${token}`,
            },
        })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);
    const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const productsToDisplay = searchQuery ? filteredProducts : products;

    return (
        <div>
            <Navbar />
            <h1>Products</h1>
            <div className="search-bar">
                <input type="text" placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="product-grid">
            {/* Product List */}
                {productsToDisplay.map((product) => (
                    <div key={product.id} className="product-card">
                        {/* <p>{product.quantity}</p> */}
                        {product.image && (
                            <img className="product-image"
                            src={`http://127.0.0.1:8000/inventory/${product.image.replace(/^\/|\/$/g, "")}`}
                            alt={product.name}
                            />
                        
                        )}
                        <h3 className="product-name">{product.name}</h3> 
                        <p className="product-price">{product.price}</p>
                        <button className="add-to-cart" onClick={() => addToCart(product.id)}>Add to Cart</button>
                    </div>
                ))}
                </div>
            </div>
    );
};

export default Products;

