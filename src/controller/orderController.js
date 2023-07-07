const orderModel = require("../model/orderModel")

const createOrder = async function(req,res){
    try{

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

const updateOrder = async function(req,res){
    try{

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports={createOrder,updateOrder}