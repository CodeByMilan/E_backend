import express ,{Application,Request,Response}from 'express'

const app:Application =express()
const PORT:number= 3000

//using .evn file 
import * as dotenv from "dotenv";
dotenv.config();
// require ("./model/index")
import './database/connection'

// admin seeder 
import adminSeeder from './adminSeeder';
adminSeeder()

import userRoute from './routes/userRoute'
import  productRoute from './routes/productRoutes'
import categoryController from './controller/categoryController';
app.use(express.json())
//loacalhost:3000/register
app.use("",userRoute)

app.use("/admin",productRoute)

app.listen(PORT,()=>{
    categoryController.seedCategory()
    console.log(`Server is running on port ${PORT}`)
    })

