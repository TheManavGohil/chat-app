import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectMongo } from './lib/db.js'
import cookieparser from 'cookie-parser'
import cors from 'cors'

dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: 'http://localhost:5174',
    credentials:true
}))

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)

app.listen(PORT, ()=>{
    console.log('Server is running on port : '+ PORT)
    connectMongo() 
})