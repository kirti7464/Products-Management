const cartModel= require("../model/cartModel")
const productModel= require("../model/productModel")
const userModel = require("../model/userModel")
const createCart = async function(req,res){
    try{
        let userId= req.params.userId
        let {cartId,productId,quantity}=req.body
        let cart = await cartModel.findOne({userId:userId})
        let data={}
        let product = await productModel.findOne({_id:productId,isDeleted:false})
        if(!cart){
            data.userId=userId
            data.items=[]
            data.items.push({
                productId:productId,
                quantity:quantity

            })
            
            data.totalPrice=product.price*quantity
            data.totalItems=quantity
            let createdCart =await cartModel.create(data)
            return res.status(201).send({status:true, message: "Cart is created",data:createdCart})
        }
        //
        
        data.userId=userId
        data.items=[...cart.items]
        let itemNumber = cart.items.length
        
        data.items[itemNumber]={
            productId:productId,
            quantity:quantity
        }
        
        // data.items[itemNumber].productId=productId
        
        // data.items[itemNumber].quantity=cart.items[itemNumber-1].quantity+1
        // console.log(quantity)
        data.totalPrice=cart.totalPrice+ (product.price * quantity)
        
        data.totalItems= cart.totalItems+quantity
        let updatedCart= await cartModel.findOneAndUpdate({_id:cartId},data,{new:true})
        return res.status(200).send({status:true, message: "Product is added to the cart",data:updatedCart})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const updateCart = async function(req,res){
    try{
        let userId= req.params.userId
        let {cartId,productId,removeProduct}=req.body
        let cart = await cartModel.findOne({userId:userId})
        if(!cart) {
            return res.status(404).send({ status: false, message: "Cart does not exist" })
        }
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message: "Please provide valid user" })
        }
        let product = await productModel.findOne({_id:productId,isDeleted:false})
        if(!product){
            return res.status(404).send({ status: false, message: "There is no such product" })
        }
        let items=cart.items
        if(removeProduct==0){
            
            return res.status(200).send({status:true, message: "Product is deleted from the cart",data:productToBeRem})
        }
        else if(removeProduct==1){

        }
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}
const getCart = async function(req,res){
    try{
        let userId=req.params.userId
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message: "Please provide valid user" })
        }
        let cart= await cartModel.findOne({userId:userId})
        if(!cart){
            return res.status(404).send({ status: false, message: "There is no cart for this user" })
        }
        return res.status(200).send({status:true, message: "Detail of cart of this user",data:cart})

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const delCart = async function(req,res){
    try{
        let userId=req.params.userId
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message: "Please provide valid user" })
        }
        let cart= await cartModel.findOne({userId:userId})
        if(!cart){
            return res.status(404).send({ status: false, message: "There is no cart for this user" })
        }
        cart.items=[]
        cart.totalItems=0
        cart.totalPrice=0
        console.log(cart)
        return res.status(200).send({status:true, message: "Detail of cart of this user",data:cart})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports ={createCart,getCart,updateCart,delCart}