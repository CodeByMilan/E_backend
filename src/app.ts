import express ,{Application,Request,Response}from 'express'

const app:Application =express()
const PORT:number= 3000

//using .evn file 
import * as dotenv from "dotenv";
dotenv.config();
// require ("./model/index")
import './database/connection'

import userRoute from './routes/userRoute'
import  productRoute from './routes/productRoutes'
app.use(express.json())
//loacalhost:3000/register
app.use("",userRoute)

app.use("",productRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    })

