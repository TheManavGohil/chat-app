import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'


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

    getMessages : async(userId) => {
        set({ isMessagesLoading : true })
        try{
            res = await axiosInstance.get(`/messages/${userId}`)
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

    //optimize later
    setSelectedUser: (selectedUser) => set({ selectedUser }), 


}))