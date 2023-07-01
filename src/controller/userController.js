const userModel=require("../model/userModel")
const multer = require("multer")
const {uploadFile}= require("../util/aws")
const { hassPassWord, comparePassword }= require("../util/bcrypt")
const {isValidString,isValidEmail,isValidIndianPhone, isValidPass,isValidPincode,isValidObjectId} =require("../util/validations")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {SECRET_KEY}=process.env

const registerUser= async function(req,res){
    try{
        //non-number in pincode gives a error from catch block
        let data=JSON.parse(req.body.input)
        let files=req.files
        let {fname,lname,email,phone,password,address}= data
        
        if(!(fname) || !(isValidString(fname))){
            return res.status(400).send({status: false, message : "Please provide first name (in valid format)"})
        }
        if(!(lname) || !(isValidString(lname))){
            return res.status(400).send({status: false, message : "Please provide last name (in valid format)"})
        }
        if(!(email)|| !(isValidEmail(email))){
            return res.status(400).send({status: false, message : "Please provide email (in valid format)"})
        }
        if(!phone || !isValidIndianPhone(phone)){
            return res.status(400).send({status: false, message : "Please provide phone number (in valid format) "})
        }
        if(!password ||!(isValidPass(password))){
            return res.status(400).send({status: false, message : "Please provide password (at least one uppercase letter, one lowercase letter, one number and one special character)..it can have minimun 8 and maximum 15 char"})
        }
        if(!files||files.length==0){
            return res.status(400).send({status: false, message : "Please provide profile image"})
        }
        if(!(address.shipping)|| !(address.shipping.street)|| !(address.shipping.city)|| !(address.shipping.pincode)){
            return res.status(400).send({status: false, message : "Please provide proper shipping address"})
        }
        if(!(address.billing)|| !(address.billing.street)|| !(address.billing.city)|| !(address.billing.pincode)){
            return res.status(400).send({status: false, message : "Please provide proper billing address"})
        }
        
        //valid shipping address
        if(!(isValidString(address.shipping.street))||!(isValidString(address.shipping.city))||!(isValidPincode(address.shipping.pincode)))
        {
            return res.status(400).send({status: false, message : "Please provide valid shipping address (street and city should be string and pincode should be a number)"})
        }
        //valid billing address
        if(!(isValidString(address.billing.street))||!(isValidString(address.billing.city))||!(isValidPincode(address.billing.pincode)))
        {
            return res.status(400).send({status: false, message : "Please provide valid billing address (street and city should be string and pincode should be a number)"})
        }
        //unique email
        let duplicateEmail= await userModel.findOne({email:email})
        if(duplicateEmail) {
            return res.status(400).send({status: false, message : "Please provide unique email"})
        }
        //unique phone 
        let duplicatePhone= await userModel.findOne({phone:phone})
        if(duplicatePhone){
            return res.status(400).send({status: false, message : "Please provide unique phone number"})
        }
        //AWS-S3 link after uploading profileImage
        let profileImgUrl = await uploadFile(files[0]);
        data.profileImage = profileImgUrl;
        //hashing password
        data.password= await hassPassWord(data.password)

        let user=await userModel.create(data)
        return res.status(201).send({status:true, message: "User is registered",data:user})
    }
    catch(err){
        return res.status(500).send({ status: false, message: err.message })
    }
}

const loginUser = async function(req,res){
    try{
        let input=req.body
        let {email,password}=input

        if(!email || !password) return res.status(400).send({status: false, message : "email or password is missing"})

        if(!isValidEmail(email)) return res.status(400).send({status: false, message : "please provide valid email"})

        let user= await userModel.findOne({email:email})
        if(!user) return res.status(404).send({ status: false, message: "User does not exist" })

        //checking password
        const passwordStatus=await comparePassword(password,user.password)
        if(!passwordStatus){
            return res.status(401).send({ status: false, message: "wrong credientials" })
        }

        let token=jwt.sign({userId:user._id,exp:8934834023},SECRET_KEY)
        return res.status(200).send({ status: true, message: "User login successfully", data: { userId: user._id, token: token } })
    }
    catch(err){
        return res.status(500).send({status: false, message : err.message})
    }
}

const getUser = async function(req,res){
    try{
        let userId=req.params.userId
        //checking typeof userId
        if(!isValidObjectId(userId)) return res.status(400).send({status: false, message : "Please provide valid userId"})
        let user = await userModel.findById(userId)
        
        return res.status(200).send({status: true,message: 'Success',data:user})
    }
    catch(err){
        return res.status(500).send({status: false, message : err.message})
    }
}

const updateUser = async function(req,res){
    try{
        let userId=req.params.userId
        let data=JSON.parse(req.body.input)
        let files=req.files
        let {fname,lname,email,phone,password,address}= data
        
        //checking typeof userId
        if(!isValidObjectId(userId)) return res.status(400).send({status: false, message : "Please provide valid userId"})

        //image validation check
        if((files)){
            if(files.length==0) return res.status(400).send({status: false, message : "Please provide profile image"})
            let profileImgUrl = await uploadFile(files[0]);
            data.profileImage = profileImgUrl;
        }
        //fname validation check
        if(fname){
            if(!(isValidString(fname))){
                return res.status(400).send({status: false, message : "Please provide valid first name"})
            }
        }
        //lname validation check
        if(lname){
            if(!(isValidString(lname))){
                return res.status(400).send({status: false, message : "Please provide valid last name "})
            }
        }
        //email validation check
        if(email){
            if(!(isValidEmail(email))){
                return res.status(400).send({status: false, message : "Please provide valid email"})
            }
            //unique email
            let duplicateEmail= await userModel.findOne({email:email})
            if(duplicateEmail) {
                return res.status(400).send({status: false, message : "Please provide unique email"})
            }
        }
        //phone validation check
        if(phone){
            if(!(isValidIndianPhone(phone))){
                return res.status(400).send({status: false, message : "Please provide valid phone number"})
            }
            //unique phone 
            let duplicatePhone= await userModel.findOne({phone:phone})
            if(duplicatePhone){
                return res.status(400).send({status: false, message : "Please provide unique phone number"})
            }
        }
        //password validation check
        if(password){
            if(!(isValidPass(password))){
                return res.status(400).send({status: false, message : "Please provide password (must have one digit,)..it can have minimun 8 and maximum 15 char"})
            }
            data.password= await hassPassWord(data.password)
        }
         //valid shipping address
         if((address)&&(address.shipping)){
            if(address.shipping.street){
                if(!(isValidString(address.shipping.street)))
                {
                    return res.status(400).send({status: false, message : "Please provide valid street in the shipping address ..it should be string "})
                }
            }
            if(address.shipping.city){
                if(!(isValidString(address.shipping.city)))
                {
                    return res.status(400).send({status: false, message : "Please provide valid city in the shipping address ..it should be string"})
                }
            }
            if(address.shipping.pincode){
                if(!(isValidPincode(address.shipping.pincode)))
                {
                    return res.status(400).send({status: false, message : "Please provide valid pincode in the shipping address ..it should be a number)"})
                }
            }
         }
         //valid billing address
         if((address)&&(address.billing)){
            if(address.billing.street){
                if(!(isValidString(address.billing.street)))
                {
                    return res.status(400).send({status: false, message : "Please provide valid street in the billing address ..it should be string "})
                }
            }
            if(address.billing.city){
                if(!(isValidString(address.billing.city)))
                {
                    return res.status(400).send({status: false, message : "Please provide valid city in the billing address ..it should be string"})
                }
            }
            if(address.billing.pincode){
                if(!(isValidPincode(address.billing.pincode)))
                {
                    return res.status(400).send({status: false, message : "Please provide valid pincode in the billing address ..it should be a number)"})
                }
            }
         }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user is not found" })
        }
        // console.log(data)
        let updatedUser = await userModel.findOneAndUpdate({_id: userId},data,{new: true})
        res.status(200).send({ status: true, message: "Succesfully updated", data: updatedUser });
    }
    catch(err){
        return res.status(500).send({status: false, message : err.message})
    }
}

module.exports ={registerUser,loginUser,getUser,updateUser}