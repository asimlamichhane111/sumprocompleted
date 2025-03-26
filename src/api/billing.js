import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8000/billing/api";

export const downloadReceipt = async (orderId) => {
    const response = await axiosInstance.get(`${API_URL}/receipt/${orderId}/`, {
        responseType: 'blob', // Important for downloading files
    });
    return response.data;
};

export const fetchOrderHistory = async () => {
    try{
        const token=localStorage.getItem("token");
        const response = await axiosInstance.get(`${API_URL}/order-history/`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    return response.data;
    }
    catch(error){
        if(error.response?.status==401){
            localStorage.removeItem("token");
        }
        throw error;
    }
    
};

export const fetchSalesAnalytics = async () => {
    const response = await axiosInstance.get(`${API_URL}/sales-analytics/`);
    return response.data;
};