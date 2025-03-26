import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import '../../components/ProductCard.css';

const Beer = () => {
    const [beers, setBeers] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://127.0.0.1:8000/inventory/api/products/?category=beer", {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setBeers(response.data))
        .catch((error) => console.error("Error fetching beers:", error));
    }, []);

    return (
        <div>
          <Navbar/>
            <h2>Beer</h2>
            <div className="product-grid">
                {beers.map((beer) => (
                    <div key={beer.id} className="product-card">
                        {/* <p>Stock: {beer.quantity}</p> */}
                        {beer.image && (
                            <img className="product-image"
                            src={`http://127.0.0.1:8000/inventory/${beer.image.replace(/^\/|\/$/g, "")}`}
                            alt={beer.name}
                            />
                        )}
                        <h3 className="product-name">{beer.name}</h3>
                        <p className="product-price">{beer.price}</p>
                        <button className="add-to-cart" onClick={() => addToCart(beer.id)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Beer;
