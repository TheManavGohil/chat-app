import cloudinary from '../lib/cloudinary.js'
import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bycrypt from 'bcryptjs'

export const signup= async (req, res)=>{
    const {fullName, email, password} = req.body 
    try{
        if(!fullName || !email || !password){
            return res.status(400).json({ message : 'All fields are required' })
        }
        if(password.length < 6){
            return res.status(400).json({ message : 'Password must be atleast 6 digit' })
        }

        const user = await User.findOne({email})
        if(user){
            res.status(400).json({ message : 'User already exists' })
        }

        const salt = await bycrypt.genSalt(10)
        const hashedpassword = await bycrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedpassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic 
            })
        }else{
            res.status(400).json('Invalid user data')
        }   
    }catch(err){
        console.log('Error in Signup controller ', err)
        res.status(500).json({ message : 'Internal Server Error' })
    }
}

export const login= async (req, res)=>{
    try { 
        const { email, password } = req.body

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message:'Invalid Credentials'})
        }

        const isPasswordCorrect = await bycrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(401).json({message:'Invalid Credentials'})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic 
        })
    }
    catch(err){
        console.log('Error in login controller ', err)
        res.status(500).json({ message : 'Internal Server Error' })
    }
}

export const logout= (req, res)=>{
    try{
        res.cookie('jwt', "", { maxAge:0 })
        res.status(200).json({ message: 'Logged out successfully'} )
    }
    catch(err){
        console.log('Error in logout controller ', err)
        res.status(500).json({ message : 'Internal Server Error' })
    }
}

export const updateProfile = async (req, res)=>{
    try{
        const { profilePic } = req.body
        const userId = req.user._id

        if(!profilePic){
            res.status(400).json({ message: 'Profile photo required' })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new:true}
        )

        res.status(200).json(updatedUser)
    }catch(error){
        console.log('Error in updated profile', error)
        res.status(500).json({message:'Internal Server Error'})
    }
}

export const checkAuth = async (req, res) =>{
    try{
        res.status(200).json(req.user)
    }catch(error){
        console.log('error in check auth controller ', error.message)
        res.status(500).json('Internal Server Error')
    }
}


