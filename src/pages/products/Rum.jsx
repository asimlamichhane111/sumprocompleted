import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import '../../components/ProductCard.css';

const Rum = () => {
    const [rums, setRums] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://127.0.0.1:8000/inventory/api/products/?category=rum", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setRums(response.data))
        .catch((error) => console.error("Error fetching rums:", error));
    }, []);

    return (
        <div>
            <Navbar />
            <h2>Rum</h2>
            <div className="product-grid">
                {rums.map((rum) => (
                    <div key={rum.id} className="product-card">
                        {/* <p>Stock: {rum.quantity}</p> */}
                        {rum.image && (
                            <img className="product-image"
                                src={`http://127.0.0.1:8000/inventory/${rum.image.replace(/^\/|\/$/g, "")}`}
                                alt={rum.name}
                            />
                        )}
                        <h3 className="product-name">{rum.name}</h3>
                        <p className="product-price">{rum.price}</p>
                        <button className="add-to-cart" onClick={() => addToCart(rum.id)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rum;

  