import { Image as ImageIcon, Send, X } from "lucide-react"
import { useRef, useState } from "react"
import toast from 'react-hot-toast'
import { useChatStore } from "../store/useChatStore"

// Function to compress images before upload
const compressImage = (imageFile, maxSizeMB = 1) => {
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
                const maxDimension = 1200; // Max width/height in pixels
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

export const MessageInput = () => {

    const [ text, setText ] = useState('')
    const [ imagePreview, setImagePreview ] = useState(null)
    const [ isCompressing, setIsCompressing ] = useState(false)
    const fileInputRef = useRef(null) 
    const { sendMessage } = useChatStore() 

    const handleImageChange = async (e) =>{
        const file = e.target.files[0]
        if(!file) return;
        
        if(!file.type.startsWith("image/")){
            toast.error('Please select an Image file')
            return 
        }

        try {
            setIsCompressing(true);
            // Compress the image before setting preview
            const compressedImage = await compressImage(file);
            setImagePreview(compressedImage);
        } catch (error) {
            console.error("Error compressing image:", error);
            toast.error("Error processing image. Please try a different one.");
        } finally {
            setIsCompressing(false);
        }
    }

    const removeImage = () => {
        setImagePreview(null)
        if(fileInputRef.current){
            fileInputRef.current.value = ""
        }            
    }

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if(!text && !imagePreview){
            return
        }

        try{
            await sendMessage({
                text: text.trim(),
                image: imagePreview
            })

            setText('')
            setImagePreview(null)
            if(fileInputRef.current){
                fileInputRef.current.value= ''
            }
        }catch(error){
            toast.error(`Error while sending message : ${error.message}`)
        }

    } 

    return <>
    <div className="p-4 w-full">
        {imagePreview && (
            <div className="mb-3 flex items-center gap-2">
                <div className="relative">
                    <img
                        src={imagePreview}
                        alt='Preview'
                        className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                    />
                    <button
                        onClick={removeImage}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
                        type="button"
                    >
                    <X className="h-3 w-3"/>
                    </button>
                </div>
            </div>
        )}  
        
        {isCompressing && (
            <div className="text-sm text-center mb-2">
                Optimizing image...
            </div>
        )}  
        
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <div className="flex-1 flex gap-2">
                <input
                    type="text"
                    className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                    value={text}
                    placeholder="Type the message..."
                    onChange={ (e) => setText(e.target.value) }
                >
                </input>

                <input 
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageChange}
                >
                </input>
                <button 
                    type="button"
                    className={`hidden sm:flex items-center btn btn-circle ${imagePreview ?  "text-emerald-500" : "text-zinc-400"}`}
                    onClick={() => { fileInputRef.current?.click() }}
                    disabled={isCompressing}
                >
                    <ImageIcon size={35} />
                </button>
            </div>
            <button
                type="submit"
                className="btn btn-sm btn-circle flex items-center"
                disabled={(!text.trim() && !imagePreview) || isCompressing}
            >
                <Send size={35} />
            </button>
        </form>

    </div>
    </>
}