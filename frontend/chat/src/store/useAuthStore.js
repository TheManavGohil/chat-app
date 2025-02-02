import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create( (set) => ({
    authUser : null,

    isSigningUp : false,
    isLogingIn :  false,
    isUpdatingProfile :  false,

    isCheckingAuth : true,

    checkAuth : async () =>{
        try{
            const res = await axiosInstance.get('/auth/check')

            set({authUser: res.data})
        }catch(error){
            console.log('error in checkAuth: ',error)

            set({authUser: null})
        }finally{
            set({isCheckingAuth: false})
        }
    },

    signup : async (data) => {
        try{
            const res = await axiosInstance.post('/auth/signup', data)
            set({authUser: res.data})

            toast.success('Account created successfully!')
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isSigningUp:false})
        }
    },

    logout : async () =>{
        try{
            await axiosInstance('/auth/logout')
            set({ authUser:null })
            toast.success('Logout Successfull!')
        }catch(error){
            toast.error(error.response.data.message)
        }
    },

    login : async(data) =>{

    },
}))