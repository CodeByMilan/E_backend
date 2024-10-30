import { Request,Response } from "express";
import User from "../database/models/User";
import bcrypt from  "bcrypt";

class AuthController {
   public static async registerUser(req:Request,res:Response):Promise<void>
    {
        const {username,email,password}=req.body
        if(!username || !email || !password){
            res.status(400).json({
                message:"Please enter username,email,password"
                })
                return
            }
            await User.create({
                username,
                email,
                //8:salt value means deciding the strength of the password 
                //putting the more salt value results in more time to hash the password due to which it will take more time so for better user experience its recommended to use middle value  of salt
                password:bcrypt.hashSync(password,10)
            })
            res.status(200).json({
                message:"User created successfully"
                })
        }
    }
    
    export  default AuthController;  