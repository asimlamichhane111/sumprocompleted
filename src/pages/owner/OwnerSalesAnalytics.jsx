import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";

const OwnerSalesAnalytics = () => {
  const [chart, setChart] = useState("");

  useEffect(() => {
    const fetchSalesAnalytics = async () => {
      try {
        const response = await axiosInstance.get("/billing/api/sales-analytics/");
        setChart(response.data.chart);
      } catch (error) {
        console.error("Error fetching sales analytics:", error);
      }
    };

    fetchSalesAnalytics();
  }, []);

  return (
    <div>
      <Navbar/>
      <h1>Sales Analytics</h1>
      {chart && <img src={`data:image/png;base64,${chart}`}  width={800} height={400}   alt="Sales Chart" />}
    </div>
  );
};

export default OwnerSalesAnalytics;