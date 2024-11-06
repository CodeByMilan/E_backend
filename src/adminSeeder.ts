
import User from "./database/models/User"
import bcrypt from 'bcrypt'

const adminSeeder =async ():Promise <void>=>{
    //[] means destructring 
   const [data]= await User.findAll({
        where:{
            email:"admin@gmail.com"
        }

    })
    if(!data){
        await  User.create({
            email:"admin@gmail.com",
            password:bcrypt.hashSync("admin123",10),
            username:"admin",
            role:"admin"
            })
            console.log("admin credentials seeded successfully ")
            }
            else{
                console.log("admin credentials already seeded")
            }
    }
    export default adminSeeder; 