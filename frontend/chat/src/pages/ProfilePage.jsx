import { useState } from "react"
import { Camera, Mail, User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import toast from "react-hot-toast"

// Function to compress images before upload
const compressImage = (imageFile) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions while maintaining aspect ratio
                const maxDimension = 800; // Profile pics can be smaller
                if (width > height && width > maxDimension) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get compressed image as DataURL
                const quality = 0.7; // Adjust quality as needed (0.7 = 70% quality)
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
};

export const ProfilePage = () =>{
    
    const { authUser, isUpdatingProfile, updateProfile } = useAuthStore()
    const [selectedImage, setSelectedImage] = useState(null)
    const [isCompressing, setIsCompressing] = useState(false)

    const handleImageUpload = async (e) =>{
        try{
            const file = e.target.files[0]
            if(!file){
                return
            }

            setIsCompressing(true)

            // Compress the image before uploading
            const compressedImage = await compressImage(file)
            setSelectedImage(compressedImage)
            
            // Update profile with compressed image
            await updateProfile({ profilePic: compressedImage })
            
            toast.success('Profile Photo updated Successfully!')
        } catch(error) {
            console.error("Error updating profile:", error)
            toast.error('Error while updating profile photo')
        } finally {
            setIsCompressing(false)
        }
    }

    
    return <>
    <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
            <div className="bg-base-300 rounded-xl p-6 space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Profile</h1>
                    <p className="mt-2">Your profile information</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <img 
                            src={selectedImage || authUser?.profilePic || '/avatar.png'}
                            alt="profile"
                            className="h-32 w-32 rounded-full object-cover border-4"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 
                                        p-2 rounded-full cursor-pointer transition-all duration-200 
                                        ${(isUpdatingProfile || isCompressing) ? 'animate-pulse pointer-events-none' : ''} `}
                        >
                            <Camera className="h-5 w-5 text-base-200" />
                            <input  
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id='avatar-upload'
                                onChange={handleImageUpload}
                                disabled={isUpdatingProfile || isCompressing}
                            />
                        </label>
                    </div>
                    <p className="text-sm text-zinc-400">
                        {isCompressing ? 'Optimizing image...' : 
                         isUpdatingProfile ? 'Uploading...' : 
                         'Click on the camera icon to update' }
                    </p>
                </div>
                
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <User className="w-4 h-4"/>
                            Full Name
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                    </div>
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4"/>
                            Email Address
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                    </div>
                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">About Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                    <span>Member Since</span>
                                    <span>{authUser?.createdAt?.split('T')[0]}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span>Account Status</span>
                                    <span className="text-green-500">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
}