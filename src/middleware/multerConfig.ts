import { Request } from "express";
import multer from  "multer";

const storage = multer.diskStorage({
  destination: (req:Request, file:Express.Multer.File, cb:any) => {
    console.log(file)
    const allowedtyes:string[] =['image/png','image/jpeg','image/jpg']
    if(!allowedtyes.includes(file.mimetype)){
       cb(new Error('Invalid file type'))
       return
      }
    cb(null, './src/storage');  
  },
  filename: (req:Request, file:Express.Multer.File, cb:any) => {
    cb(null,Date.now()+"-"+ file.originalname); 
  },
});
 
export {
  multer,
  storage
};
