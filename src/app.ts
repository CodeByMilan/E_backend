import express, { Application, Request, Response } from "express";

//using .evn file
import * as dotenv from "dotenv";
dotenv.config();

// require ("./model/index")
import "./database/connection";
const app: Application = express();
const PORT: number = 3000;
app.use(express.static("./src/storage/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

// admin seeder
import adminSeeder from "./adminSeeder";
adminSeeder();

import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoutes";
import categoryController from "./controller/categoryController";
import categoryRoutes from "./routes/categoryRoutes";
import cartRoute from "./routes/cartRoutes";
import orderRoute from "./routes/orderRoutes";
import { Server } from "socket.io";
import { promisify } from "util";
import jwt from "jsonwebtoken";

//loacalhost:3000/register
app.use("", userRoute);

app.use("", productRoute);

app.use("", categoryRoutes);
app.use("/customer", cartRoute);
app.use("/order", orderRoute);

const server = app.listen(PORT,()=>{
  categoryController.seedCategory()
  console.log("Server has started at port ", PORT)
})
const io = new Server(server,{
  cors : {
      origin : ['http://localhost:5173','http://localhost:5174']
  }
})

let onlineUsers:any = []
const addToOnlineUsers = (socketId:string,userId:string,role:string)=>{
  onlineUsers = onlineUsers.filter((user:any)=>user.userId !==userId)
  onlineUsers.push({socketId,userId,role})
}
io.on("connection",async (socket)=>{
  console.log("A client connected")
  const {token} = socket.handshake.auth 
  if(token){
      //@ts-ignore
      const decoded = await promisify(jwt.verify)(token,process.env.SECRET_KEY)
      //@ts-ignore
      const doesUserExists = await User.findByPk(decoded.id)
      if(doesUserExists){
          addToOnlineUsers(socket.id,doesUserExists.id,doesUserExists.role)
      }
  }
  socket.on("updatedOrderStatus",({status,orderId,userId})=>{
      const findUser = onlineUsers.find((user:any)=>user.userId == userId)
      if(findUser){
          io.to(findUser.socketId).emit("statusUpdated",
              {status,orderId}
          )
      }
  })
  console.log(onlineUsers)
})
