import multer from 'multer'
import {Request} from 'express'

const storage = multer.diskStorage({
    destination : function(req:Request,file:Express.Multer.File,cb:any){
        const allowedFileTypes = ['image/jpg','image/png','image/jpeg']
        if(!allowedFileTypes.includes(file.mimetype)){
            cb(new Error("This filetype is not accepted"))
            return
        }
        // console.log("File mimetype:", file.mimetype); 
        cb(null,'./src/storage')
    },

    filename : function(req:Request,file:Express.Multer.File,cb:any){
      // console.log("Original filename:", file.originalname);
        cb(null, Date.now() + "-" + file.originalname)
    }
})

export {
    multer, 
    storage 
}