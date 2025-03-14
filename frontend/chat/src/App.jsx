import { useCallback, useEffect, useState } from 'react'
import './App.css'

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Navbar } from './components/Navbar'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { Loader } from 'lucide-react'
import { Toaster } from "react-hot-toast"

function App() {
  
  const { checkAuth, authUser, isCheckingAuth, onlineUsers } = useAuthStore()
  const { theme } = useThemeStore()

  console.log({ onlineUsers })

  useEffect(()=>{
    checkAuth()
  }, [])

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
  })

  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size=10 animate-spin' />
      </div>
    )
  }


  return (
    <>
      <div>

        <Navbar />

        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
          <Route path='/signup' element={!authUser ? <SignupPage /> : <Navigate to='/' />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
          <Route path='/settings' element={<SettingsPage />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        </Routes>

        <Toaster /> 
      </div>
    </>
  )
}

export default App
