import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true,
            sparse: true,  
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        fullName:{
            type: String,
            required: function () {
                return !this.googleId;  // Only require fullName if no googleId
            },
        },
        password:{
            type: String,
            minlength: 6,
            required: function () {
                return !this.googleId;  // Only required if not using Google OAuth
            }
        },
        profilePic:{
            type: String,
            default: ""
        }
    },
    { timestamps: true }
)


const User = mongoose.model('User', userSchema)

export default User 