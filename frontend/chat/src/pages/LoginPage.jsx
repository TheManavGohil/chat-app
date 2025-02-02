import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"
import AuthImagePattern from "../components/AuthImagePattern"

export const LoginPage = () =>{
    
    const [showpassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const { login, isLogingIn } = useAuthStore()

    const handleSubmit = (e) =>{
        e.preventDefault()
        login(formData)
    }


    return <>
    <div className="h-screen grid grid-cols-2">
        <div className="flex flex-col h-screen p-6 sm:p-12  ">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                        <p>Sign in to your Account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">E-mail</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-base-content/40" />
                            </div>
                            <input
                                type="email"
                                className="input input-bordered w-full pl-10"
                                placeholder="John@gmail.com"
                                value={formData.email}
                                onChange={(e)=> setFormData({ ...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className='size-5 text-base-content/40'/>
                            </div>
                            <input
                                type = {showpassword ? 'text' : 'password'}
                                className="input input-bordered w-full pl-10"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e)=> setFormData({ ...formData, password:e.target.value})}
                            />
                            <button 
                                type='button'
                                className="absolute inset-y-0 right-0 pr-3 flex items-center "
                                onClick={() => {setShowPassword(!showpassword) }}
                            >{ showpassword ? ( <EyeOff className="size-5 text-base-content/40"/> ) : ( <Eye className='size-5 text-base-content/40'/> )}
                            </button>
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full" disabled={isLogingIn}>
                        {isLogingIn ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>

                </form>

                <div className="text-center">
                        <p className="text-base-content/60 pb-10">
                            Already have an account?{" "}
                            <Link to='/signup' className="link link-primary">
                                Sign-up
                            </Link>
                        </p>
                </div>
            </div>
        </div> 


        <AuthImagePattern   
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />

    </div>
    </>
}