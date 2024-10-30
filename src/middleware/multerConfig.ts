// import { Request } from "express";
// import multer from  "multer";

// const storage = multer.diskStorage({
//   destination: (req:Request, file:, cb) => {
//     console.log(file)
//     const allowedtyes:string[] =['image/png','image/jpeg','image/jpg']
//     if(!allowedtyes.includes(file.mimetype)){
//        cb(new Error('Invalid file type'))
//        return
//       }
//     cb(null, './storage');  
//   },
//   filename: (req:Request, file, cb) => {
//     cb(null, file.originalname); 
//   },
// });
 
// module.exports = {
//   storage,
//   multer  
// };
