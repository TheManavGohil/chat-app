import axios from 'axios'

export const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL,
    baseURL: "http://localhost:5001/api",
    withCredentials: true
})

// backend deployed vercel url : https://chat-app-ten-coral-50.vercel.app/