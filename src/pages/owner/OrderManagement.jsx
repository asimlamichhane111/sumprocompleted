import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./OrderManagement.css"; // Import CSS for styling

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders and employees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axiosInstance.get("/api/orders");
        console.log("API Response:",ordersResponse.data);

        const ordersData=ordersResponse.data.orders||[];
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update order status (accept/reject)
  const updateOrderStatus = async (orderId, status) => {
    console.log("Updating order ID:", orderId); // Log the order ID
    try {
        const response = await axiosInstance.patch(`/api/orders/${orderId}/`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        console.log("Order status updated:", response.data);
        alert(`Order ${orderId} has been ${status}`);
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, status: status } : order
            )
        );
        // Optionally, refresh the orders list after updating the status
        // fetchOrders();
    } catch (error) {
        console.error("Error updating order status:", error);
        alert("Failed to update order status.");
    }
  };

  // Assign order to owner
  // const assignOrderToOwner = async (orderId) => {
  //   try {
  //     await axiosInstance.post(`/api/orders/${orderId}/assign`, {assignedTo:"owner"});
  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) =>
  //         order.id === orderId ? { ...order, assignedTo:"owner"} : order
  //       )
  //     );
  //   } catch (err) {
  //     setError("Failed to assign order to owner.");
  //   }
  // };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="order-management">
      <h1>Order Management</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Customer Phone</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
            {/* <th>Assign to Owner</th> */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}</td>
              <td>{order.customer_phone}</td>
              <td>
                <ul>
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.product}`}>
                      {item.product_name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </td>
              <td>Rs{order.total_price}</td>
              <td>{order.status}</td>
              <td>
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, "completed")}
                      className="btn-accept"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "cancelled")}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
              {/* <td>
                {order.status === "accepted" && (
                  <button
                    onClick={() => assignOrderToOwner(order.id)}
                    className="btn-assign"
                  >
                    Assign to Owner
                  </button>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderManagement;