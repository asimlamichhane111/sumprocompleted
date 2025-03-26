import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import './OwnerProduct.css';

const OwnerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/inventory/api/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  const handleAddToInventory=async(productId)=>{
    try {
      const response = await axiosInstance.post(`/inventory/api/products/${productId}/add_to_inventory/`);
      if (response.status === 200) {
        alert("Product added to inventory successfully!");
        // Optionally, you can update the product list or state here
        const updatedProducts = products.map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity + 1 } // Increment the quantity
            : product
        );
        setProducts(updatedProducts);
      }
    } catch (error) {
      console.error("Error adding product to inventory:", error);
      alert("Failed to add product to inventory.");
    }
  };
const handleUpdateProduct = async (productId, newPrice, newStock) => {
  try {
    const response = await axiosInstance.put(`/inventory/api/products/${productId}/`, {
      price: newPrice,
      quantity: newStock,
    });
    if (response.status === 200) {
      alert("Product updated successfully!");

      // Update the state to reflect the new price and stock
      const updatedProducts = products.map((product) =>
        product.id === productId
          ? { ...product, price: newPrice, quantity: newStock } // Update price and stock
          : product
      );
      setProducts(updatedProducts); // Update the state
    }
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Failed to update product.");
  }
};


  return (
    <div>
      <Navbar />
        <h1>Product Management</h1>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              {product.image && (
                            <img className="product-image"
                            src={`http://127.0.0.1:8000/inventory/${product.image.replace(/^\/|\/$/g, "")}`}
                            alt={product.name}
                            />
                        
                        )}
              <h3 className="product-name">{product.name}</h3>
              <div className="input-group">
              <label>Price:</label>
              <input
                type="number"
                defaultValue={product.price}
                onChange={(e) => {
                  const updatedProducts = products.map((p) =>
                    p.id === product.id ? { ...p, price: e.target.value } : p
                  );
                  setProducts(updatedProducts);
                }}
              />
            </div>

            {/* Input field for stock */}
            <div className="input-group">
              <label>Stock:</label>
              <input
                type="number"
                defaultValue={product.quantity}
                onChange={(e) => {
                  const updatedProducts = products.map((p) =>
                    p.id === product.id ? { ...p, quantity: e.target.value } : p
                  );
                  setProducts(updatedProducts);
                }}
              />
            </div>

            {/* Button to update price and stock */}
            <button
              className="update-btn"
              onClick={() =>
                handleUpdateProduct(product.id, product.price, product.quantity)
              }
            >
              Update
            </button>
              
              <button
                className="add-to-inventory-btn"
                onClick={() => handleAddToInventory(product.id)}
              >
                Add to Inventory
              </button>
              {product.quantity <= product.low_stock_threshold && (
                <p className="low-stock">Low Stock!</p>
              )}
            </div>
          ))}
        </div>
      </div>

  );
};

export default OwnerProducts;