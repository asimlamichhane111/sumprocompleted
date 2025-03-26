import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth/";//should be changed according to backend

export const loginUser = async (email, password) => {
  const response = await axios.post("http://127.0.0.1:8000/users/api/login/", { email, password });
  return response.data;
};

export const registerUser = async (name, email, password,phone, role) => {
  const response = await axios.post("http://127.0.0.1:8000/users/api/register/", { 
    name, email, password,phone, role 
  });
  return response.data;
};
export const forgotPassword = async (email) => {
    const response = await axios.post("http://127.0.0.1:8000/api/auth/forgot-password/", { email });
    return response.data;
  };
export const resetPassword = async (token, newPassword) => {
const response = await axios.post("http://127.0.0.1:8000/api/auth/reset-password/", {
    token,
    password: newPassword,
  });
return response.data;
  };
  
