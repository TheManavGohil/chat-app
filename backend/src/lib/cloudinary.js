import cloudinary from 'cloudinary'

import { config } from 'dotenv'

config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Force Cloudinary to use our parameters instead of auto-generating them
cloudinary.config.use_private_cdn = false;
cloudinary.config.secure = true;

export default cloudinary