import dotenv from 'dotenv'
dotenv.config()

import path from "path"

import express from 'express'
import session from 'express-session'
import passport from 'passport'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectMongo } from './lib/db.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import { app, server } from './lib/socket.js'
import './lib/passport.js'



const PORT = process.env.PORT || 5001
const __dirname = path.resolve()

console.log("Backend __dirname:", __dirname)

// Increase payload size limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieparser())

app.use(cors({
    origin: process.env.NODE_ENV === "development" ? 'http://localhost:5173' : process.env.FRONTEND_URL ,
    credentials:true
}))

app.use(session({
    secret: process.env.SESSION_SECRET || '12345',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

if(process.env.NODE_ENV==="production"){
    const staticPath = path.join(__dirname, "../frontend/dist")
    const indexPath = path.join(__dirname, "../frontend", "dist", "index.html")

    console.log("Serving static files from:", staticPath)
    console.log("Serving index.html from:", indexPath)

    app.use(express.static(staticPath))

    app.get("*", (req,res)=>{
        res.sendFile(indexPath)
    })
}

server.listen(PORT, ()=>{
    console.log('Server is running on port : '+ PORT)
    connectMongo() 
})