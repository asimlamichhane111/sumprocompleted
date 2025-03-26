import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import '../../components/ProductCard.css';

const Vodka = () => {
    const [vodkas, setVodkas] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://127.0.0.1:8000/inventory/api/products/?category=vodka", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setVodkas(response.data))
        .catch((error) => console.error("Error fetching vodkas:", error));
    }, []);

    return (
        <div>
            <Navbar />
            <h2>Vodka</h2>
            <div className="product-grid">
                {vodkas.map((vodka) => (
                    <div key={vodka.id} className="product-card">
                        {/* <p>Stock: {vodka.quantity}</p> */}
                        {vodka.image && (
                            <img className="product-image"
                            src={`http://127.0.0.1:8000/inventory/${vodka.image.replace(/^\/|\/$/g, "")}`}
                            alt={vodka.name}
                            />
                        )}
                        <h3 className="product-name">{vodka.name}</h3>
                        <p className="product-price">{vodka.price}</p>
                        <button className="add-to-cart" onClick={() => addToCart(vodka.id)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Vodka;

  