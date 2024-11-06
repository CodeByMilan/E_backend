import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
    password: string;
  };
}
export enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
class AuthMiddleware {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    //get token from user
    const token = req.headers.authorization;

    if (!token || token === undefined) {
      res.status(403).json({
        message: "Token not provided",
      });
      return;
    }

    //verify token if it is legit or tampered
    jwt.verify(
      token,
      process.env.SECRET_KEY as string,
      async (err, decoded: any) => {
        if (err) {
          res.status(403).json({
            message: "Invalid token",
          });
        } else {
          //check if that the decoded object id user exists or  not
          try {
            const userData = await User.findByPk(decoded.id);
            if (!userData) {
              res.status(403).json({
                message: "User not found",
              });
              return;
            }
            req.user = userData;
            next();
          } catch (err) {
            res.status(500).json({
              message: "Internal server error",
            });
          }
        }
      }
    );
  }
  resetrictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "you dont have a permission ",
        });
      } else {
        next();
      }
    };
  }
}
export  default new  AuthMiddleware()