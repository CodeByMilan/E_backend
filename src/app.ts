import express ,{Application,Request,Response}from 'express'

const app:Application =express()
const PORT:number= 3000

require ("./model/index")

app.get("/",(req:Request,res:Response)=>{
    res.send("Hello World")
})

app.get ("/about",(req:Request,res:Response)=>{
    res.send("This is about page")
})
app.get ("/contact",(req:Request,res:Response)=>{
    res.send("This is contact page")
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    })

