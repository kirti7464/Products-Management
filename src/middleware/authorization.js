<<<<<<< HEAD
const jwt= require("jsonwebtoken")
const userModel= require("../model/userModel")
const authorise=async function(req,res,next){
    try{
        let decodedToken=req.decodedToken
        if(req.params.userId){
            let user = await userModel.findById(req.params.userId)
            if(!user) return res.send({status:false,message:"There is no user with this Id"})
            if(user._id!=decodedToken.userId) return res.status(403).send({status:false,message:"Unauthorised"})
            next()
        }
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

=======
const jwt= require("jsonwebtoken")
const userModel= require("../model/userModel")
const authorise=async function(req,res,next){
    try{
        let decodedToken=req.decodedToken
        if(req.params.userId){
            let user = await userModel.findById(req.params.userId)
            if(!user) return res.send({status:false,message:"There is no user with this Id"})
            if(user._id!=decodedToken.userId) return res.status(403).send({status:false,message:"Unauthorised"})
            next()
        }
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

>>>>>>> dea9d840748959539eb6cfac383a623845044cd1
module.exports = authorise