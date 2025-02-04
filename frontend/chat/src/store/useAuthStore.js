import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"

export const useAuthStore = create( (set) => ({
    authUser : null,

    isSigningUp : false,
    isLogingIn :  false,
    isUpdatingProfile :  false,
    islogingOut : false,

    isCheckingAuth : true,

    checkAuth : async () =>{
        set({ isCheckingAuth : true })
        try{
            const res = await axiosInstance.get('auth/check')

            set({ authUser : res.data })
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
        }catch(error){
            toast.error(error.response.data.message)
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
}))