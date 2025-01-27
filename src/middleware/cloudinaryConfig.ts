import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Request } from 'express';
import dotenv from 'dotenv';
dotenv.config();

try {
   
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET_KEY, 
    });

} catch (error) {
    console.error('Error during Cloudinary configuration:', error);
}
const allowedFileTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/avif', 'image/webp'];

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
        console.log(file)
        if (!allowedFileTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPG, JPEG, PNG, AVIF, and WEBP are allowed.');
        }
        //it is important to remove the extension of the file as cloudinary automatically adds the file extension while accessing the images from cloudinary in frontend
        let fileName=file.originalname.split('.')[0];
        return {
            folder: 'sajhaPasal', 
            format: file.mimetype.split('/')[1], 
            public_id: Date.now() + '-' + fileName, 
        };
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, 
    },
});

export { upload };
