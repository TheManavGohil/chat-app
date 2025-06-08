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

// Increase payload size limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieparser())

app.use(cors({
    origin: 'http://localhost:5173',
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
    app.use(express.static(path.join(__dirname, "..frontend/dist")))

    app.get("*", (req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, ()=>{
    console.log('Server is running on port : '+ PORT)
    connectMongo() 
})