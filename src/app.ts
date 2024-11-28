import express, { Application, NextFunction, Request, Response } from "express";

//using .evn file
import * as dotenv from "dotenv";
dotenv.config();

// require ("./model/index")
import "./database/connection";
const app: Application = express();
const PORT: number = 3000;
app.use(express.static("./src/uploads/"));
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
import User from "./database/models/User";

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
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
  },
});

let onlineUsers: any[] = [];

const addToOnlineUsers = (socketId: string, userId: string, role: string) => {
  console.log("Adding user to online users:", { socketId, userId, role });
  
  // Filter out any existing user with the same userId
  onlineUsers = onlineUsers.filter((user: any) => user.userId !== userId);
  console.log("Online users after filtering:", onlineUsers);
  
  // Add the new user to the list
  onlineUsers.push({ socketId, userId, role });
  console.log("Online users after adding:", onlineUsers);
};

io.on("connection", async (socket) => {
  console.log("A client connected with socket ID:", socket.id);

  const { token } = socket.handshake.auth;
  console.log("Received token:", token);

  if (token) {
    try {
      // Decoding token using promisified jwt.verify
      //@ts-ignore
      const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
      console.log("Decoded token:", decoded);

      // Find user in the database by ID
      //@ts-ignore
      const doesUserExists = await User.findByPk(decoded.id);
      if (doesUserExists) {
        console.log("User found in database:", doesUserExists);

        // Add the authenticated user to the online users list
        console.log("Adding user to online users");
        addToOnlineUsers(socket.id, doesUserExists.id, doesUserExists.role);
      } else {
        console.log("User does not exist in database.");
        socket.emit("error", { message: "User not found" });
        socket.disconnect();
      }
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        console.log("Token expired.");
        socket.emit("error", { message: "Token expired" });
      } else {
        console.error("Token verification failed:", error.message);
        socket.emit("error", { message: "Invalid or expired token" });
      }
      socket.disconnect();
    }
  } else {
    console.log("No token provided.");
    socket.emit("error", { message: "No token provided" });
    socket.disconnect();
  }

  // Handling updated order status event
  socket.on("updatedOrderStatus", ({ status, orderId, userId }) => {
    console.log("Received updatedOrderStatus event:", { status, orderId, userId });

    // Find the user in online users list
    const findUser = onlineUsers.find((user: any) => user.userId === userId);
    
    if (findUser) {
      console.log("User found in online users:", findUser);
      
      // Emit status update to the found user's socket
      console.log("Emitting status update to user with socket ID:", findUser.socketId);
      io.to(findUser.socketId).emit("statusUpdated", { status, orderId });
    } else {
      console.log("User not found in online users.");
    }
  });

  // Handling socket disconnection
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user: any) => user.socketId !== socket.id);
    console.log(`User with socket ID ${socket.id} disconnected.`);
  });

});


