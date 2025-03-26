import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import OrderManagement from "./OrderManagement";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/owner/dashboard/");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <Navbar/>
      <h1>Owner Dashboard</h1>
      {dashboardData && (
        <div>
          <p>Total Sales: Rs {dashboardData.total_sales}</p>
          <p>Total Orders: {dashboardData.total_orders}</p>
          <p>Top Products: {dashboardData.top_products.join(", ")}</p>
        </div>
      )}
      <OrderManagement/>
    </div>
  );
};

export default OwnerDashboard;