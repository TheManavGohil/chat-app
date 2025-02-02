import mongoose from 'mongoose'

export const connectMongo = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch(err){
        console.log(`MongoDB connection error: ${err}`)
    }
}