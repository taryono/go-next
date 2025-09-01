import axios from "axios";
import {useAuthStore} from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', 
    }
}); 
// Request interceptor untuk menambahkan token ke header Authorization
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor untuk handle 401 unauthorized
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
     
    if (error.response && error.response.status === 401) {

        // refresh token logic here if needed   
        
        // Handle unauthorized access, e.g., redirect to login page
        useAuthStore.getState().logout();
        //window.location.href = "/auth/login"; // Redirect to login page
    }
    return Promise.reject(error);
});