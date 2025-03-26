import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import '../../components/ProductCard.css';

const Whisky = () => {
    const [whiskies, setWhiskies] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://127.0.0.1:8000/inventory/api/products/?category=whisky", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setWhiskies(response.data))
        .catch((error) => console.error("Error fetching whiskies:", error));
    }, []);

    return (
        <div>
            <Navbar />
            <h2>Whisky</h2>
            <div className="product-grid">
                {whiskies.map((whisky) => (
                    <div key={whisky.id} className="product-card">
                        {/* <p>Stock: {whisky.quantity}</p> */}
                        {whisky.image && (
                            <img className="product-image"
                            src={`http://127.0.0.1:8000/inventory/${whisky.image.replace(/^\/|\/$/g, "")}`}
                            alt={whisky.name}
                            />
                        )}
                        <h3 className="product-name">{whisky.name}</h3>
                        <p className="product-price">{whisky.price}</p>
                        <button className="add-to-cart" onClick={() => addToCart(whisky.id)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Whisky;
