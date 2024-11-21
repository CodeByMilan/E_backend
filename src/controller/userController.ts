import { Request, Response } from "express";
import User from "../database/models/User";
import bcrypt from "bcrypt";
//for token
import Jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
   
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        res.status(400).json({
          message: "Please enter username,email,password",
        });
        return;
      }
      await User.create({
        username,
        email,
        //8:salt value means deciding the strength of the password
        //putting the more salt value results in more time to hash the password due to which it will take more time so for better user experience its recommended to use middle value  of salt
        password: bcrypt.hashSync(password, 10),
        role: role,
      });
      res.status(200).json({
        message: "User created successfully",
      });
  
  }
  public static async loginUser(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Please enter email and password",
      });
      return;
    }
    const [user] = await User.findAll({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User not found with the email",
      });
      return;
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({
        message: "Invalid email or password",
      });
      return;
    }

    //generate  token
    const token = Jwt.sign({ id: user.id }, process.env.SECRET_KEY as  string, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "User logged in successfully",
      data: token,
    });     
  }
  public static async fetchUserDetails(req: AuthRequest, res: Response): Promise<void> {
    const userDetails = await User.findAll({
    });
    if (userDetails.length > 0) {
      res.status(200).json({
        message: "user details fetched successfully",
        data: userDetails,
      });
    } else {
      res.status(404).json({
        message: "no user details found for this id",
        data: [],
      });
    }
  }
}

export default AuthController;
