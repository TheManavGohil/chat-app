import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: process.env.VITE_API_URL,
    withCredentials: true
})

// backend deployed vercel url : https://chat-app-ten-coral-50.vercel.app/