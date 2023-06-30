const userModel=require("../model/userModel")
const multer = require("multer")

const registerUser= async function(req,res){
    let input= req.body
    let files=req.files
    // res.send(input,files)
    if(files)
    return res.send(files)
    else return res.send("-1")
    
}
// Create a user document from request body. Request body must contain image.
// Upload image to S3 bucket and save it's public url in user document.
// Save password in encrypted format. (use bcrypt)

const loginUser = async function(req,res){

}
const getUser = async function(req,res){

}
const updateUser = async function(req,res){

}

module.exports ={registerUser,loginUser,getUser,updateUser}