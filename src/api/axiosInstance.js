import axios from "axios";
import isTokenExpired from "./isTokenExpired";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: { "Content-Type": "application/json", },
    withCredentials: false,
});


axiosInstance.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("access_token");

        if (accessToken && isTokenExpired(accessToken)) {
            console.error("Access token expired. Redirecting to login.");
            localStorage.removeItem("access_token");
            window.location.href = "/login"; // Redirect to login
            return Promise.reject("Session expired. Redirecting to login.");
        }
        if(accessToken){
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            console.error("Unauthorized. Redirecting to login.");
            localStorage.removeItem("access_token");
            window.location.href = "/login";
            return Promise.reject("Session expired. Redirecting to login.");
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;