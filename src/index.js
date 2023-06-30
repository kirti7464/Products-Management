const express= require("express")
const app= express()
const mongoose=require("mongoose")
const route=require("./route/route")
const multer = require("multer")
require("dotenv").config()

const {PORT,MONGODB}=process.env

app.use(express.json())
app.use(express.urlencoded({extended:true}))

mongoose.connect(MONGODB,{useNewUrlParser:true}).then(()=>console.log("Connected to MongoDB")).catch((er)=>console.log("Error in connecting mongodb",er))

// app.use( multer().any()) // Middleware to parse the request body with multer

app.use("/",route)

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})