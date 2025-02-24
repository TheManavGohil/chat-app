import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectMongo } from './lib/db.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import { app, server } from './lib/socket.js'



const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: 'http://localhost:5174',
    credentials:true
}))

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

server.listen(PORT, ()=>{
    console.log('Server is running on port : '+ PORT)
    connectMongo() 
})