import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { io } from 'socket.io-client'

const BASE_URL = 'http://localhost:5001'

export const useAuthStore = create( (set,get) => ({
    authUser : null,

    isSigningUp : false,
    isLogingIn :  false,
    isUpdatingProfile :  false,
    islogingOut : false,
    onlineUsers : [],

    isCheckingAuth : true,
    socket: null,

    checkAuth : async () =>{
        set({ isCheckingAuth : true })
        try{
            const res = await axiosInstance.get('/auth/check')

            if (!res || !res.data) {
                throw new Error("Invalid response from server");
            }

            set({ authUser : res.data })
            get().connectSocket()

        }catch(error){
            console.log('error in checkAuth: ',error.response.data.message)

            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup : async (data) => {
        set({ isSigningUp: true }) 
        try{
            const res = await axiosInstance.post('/auth/signup', data)
            set({authUser: res.data})

            toast.success('Account created successfully!')

            get().connectSocket()

        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
    },


    login : async (data) =>{
        set({ isLogingIn:true })
        try{
            const res = await axiosInstance.post('/auth/login', data)
            set({ authUser: res.data })

            toast.success('Logged in successfull!')

            get().connectSocket()

        }catch(error){
            toast.error('Invalid Credentials')
        }finally{
            set({ isLogingIn : false })
        }
    },

    logout : async () =>{
        set({ islogingOut: true })
        try{
            await axiosInstance.post('/auth/logout')
            set({ authUser:null })

            toast.success('Logout Successfull!')

            get().disConnectSocket()

        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({ islogingOut: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile:true })
        try{
            const res = await axiosInstance.put('/auth/update-profile', data)
            set({ authUser:res.data })
            toast.success('Profile updated successfully!')
        }catch(error){
            console.log('error in updating profile : ', error)
            toast.error(error.response.data.message)
        }finally{
            set({ isUpdatingProfile:false })
        }
    },

    connectSocket: () => {

        get().disConnectSocket();
        
        const { authUser, socket } = get();
        if (!authUser) return;
    
        if (socket) {
            console.log("⚠️ Socket already connected:", socket.id);
            return; 
        }
    
        console.log("🔌 Connecting to socket...");
    
        const newSocket = io(BASE_URL, {
            query: { userId: authUser._id },
            transports: ["websocket"], 
        });
    
        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
            set({ socket: newSocket });
        });
    
        newSocket.on("disconnect", () => {
            console.log("Socket disconnected");
            set({ socket: null }); 
        });
    
        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    
        set({ socket: newSocket });
    },
    
    

    disConnectSocket: () => {
        const { socket } = get();
        if (!socket) return;
    
        console.log("🔌 Disconnecting socket:", socket.id);
    
        socket.off("connect");
        socket.off("disconnect");
        socket.off("getOnlineUsers");
    
        socket.disconnect();
    
        set({ socket: null });
    }
    
}))