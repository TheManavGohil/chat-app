import dotenv from 'dotenv'
dotenv.config()

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

// Increase payload size limit for image uploads (50MB)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieparser())


const allowedOrigins = [
  'http://localhost:5174', // local frontend
   // replace with actual Vercel frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(session({
    secret: process.env.SESSION_SECRET || '12345',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

server.listen(PORT, ()=>{
    console.log('Server is running on port : '+ PORT)
    connectMongo() 
})