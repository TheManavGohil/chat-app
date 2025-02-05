import { create } from 'zustand'
import toast from 'react-hot-toast'


export const useChatStore = create( (set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isMessagesLoading:false,
    isUsersLoading: false,

}))