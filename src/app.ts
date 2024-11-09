import express ,{Application,Request,Response}from 'express'
//using .evn file 
import * as dotenv from "dotenv";
dotenv.config();

// require ("./model/index")
import './database/connection'
const app:Application =express()
const PORT:number= 3000
app.use('./src/storage', express.static('storage'));
app.use(express.json());

// admin seeder 
import adminSeeder from './adminSeeder';
adminSeeder()

import userRoute from './routes/userRoute'
import  productRoute from './routes/productRoutes'
import categoryController from './controller/categoryController';
import categoryRoutes from './routes/categoryRoutes'
import cartRoute from './routes/cartRoutes'
import orderRoute from'./routes/orderRoutes'
//loacalhost:3000/register
app.use("",userRoute)

app.use("",productRoute)

app.use("",categoryRoutes)
app.use("/customer",cartRoute)
app.use("/order",orderRoute)


app.listen(PORT,()=>{
    categoryController.seedCategory()
    console.log(`Server is running on port ${PORT}`)
    })

