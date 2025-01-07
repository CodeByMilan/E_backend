// import cloudinary from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET, 
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary.v2,
//   params: {
//     resource_type: 'auto', 
//     allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
//     transformation: [{ width: 500, height: 500, crop: 'limit' }], 
//   },
// });

// const upload = multer({ storage });

// export { upload };
