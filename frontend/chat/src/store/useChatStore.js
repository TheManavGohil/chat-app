import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'


export const useChatStore = create( (set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isMessagesLoading:false,
    isUsersLoading: false,

    getUsers : async() => {
        set({isUsersLoading: true})
        try{
            const res = await axiosInstance.get('/messages/users')
            set({ users: res.data })
        }catch(error){
            toast.error(error.response.data.messages)
        }finally{
            set({isUsersLoading:false})
        }
    },

    getMessages : async (userId) => {
        set({ isMessagesLoading : true })
        try{
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({ messages: res.data })
        }catch(error){
            toast.error(error.response.data.messages)
        }finally{
            set({ isMessagesLoading:false })
        }
    },

    sendMessage : async(MessageData) =>{
        const { selectedUser, messages } = get()
        try{
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, MessageData)

            set({ messages: [...messages, res.data]})
        }catch(error){
            toast.error(error.response?.data?.messages)
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
    
        const socket = useAuthStore.getState().socket;
    
        if (!socket) {
            console.error("🚨 Error: Socket is not connected!");
            return;
        }
    
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId !== selectedUser._id) return;
    
            set({
                messages: [...get().messages, newMessage],
            });
        });
    },
       

    unSubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        
        if (!socket) {
            console.warn("⚠️ Warning: Trying to unsubscribe but socket is null!");
            return;
        }
    
        socket.off("newMessage");
    },
    

     setSelectedUser: (selectedUser) => set({ selectedUser }), 


}))