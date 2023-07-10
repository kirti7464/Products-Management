const { isValidObjectId,isValidRequestBody } = require("../util/validations")
const cartModel= require("../model/cartModel")
const productModel= require("../model/productModel")
const userModel = require("../model/userModel")

function TotalPrice(items, products) {
    let totalPrice = 0
    for (const item of items) {
        const product = products.find(product => product._id.toString() === item.productId.toString());
        if (product) {
            totalPrice += product.price * item.quantity;
        }
    }
    return totalPrice;
}

const createCart = async function(req,res){
    try{
        let userId= req.params.userId
        let {cartId,productId,quantity}=req.body
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status : false, message : "Please provide data for creating cart"})
        }
        if(!userId || !productId ||!quantity){
            return res.status(400).send({status : false, message : "Please provide required data"})
        }
        if(!isValidObjectId(userId)) return res.satus(400).send({status:false,message:"Please provide valid user Id"})
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message: "Please provide valid user" })
        }
        if(!isValidObjectId(productId)) return res.satus(400).send({status:false,message:"Please provide valid product Id"})
        let product = await productModel.findOne({_id:productId,isDeleted:false})
        if(!product){
            return res.status(404).send({ status: false, message: "There is no such product" })
        }
        let cart = await cartModel.findOne({userId:userId})
        let data={}
        if(!cart){
            data.userId=userId
            data.items=[]
            data.totalPrice=0
            data.totalItems=0
            let createdCart =await cartModel.create(data)
            return res.status(201).send({status:true, message: "Cart is created",data:createdCart})
        }
        if(!isValidObjectId(cartId)) return res.satus(400).send({status:false,message:"Please provide valid cart Id"}) 
        
        if(cart._id.toString()!== cartId){
            return res.status(403).send({status : false, message : "CartId not matched not Authorised"})
        }

        const cartItems = cart.items.find((val) =>val.productId.toString()==productId)

        if(cartItems){
            cartItems.quantity += quantity //check
        }else{
            // If the product doesn't exist in the cart, add it as a new item
            cart.items.push({
                productId: productId,
                quantity: quantity
            });
        }
        cart.totalItems = cart.items.length;

      
        cart.totalPrice = cart.totalPrice+TotalPrice(cart.items, [product]);
        // Save the updated cart
        await cart.save();
        data._id=cart._id
        data.userId=cart.userId
        data.items =cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }))
        data.totalPrice=cart.totalPrice
        data.totalItems= cart.totalItems
        data.createdAt=cart.createdAt
        data.updatedAt = cart.updatedAt
        
        return res.status(200).send({status:true, message: "Product is added to the cart",data:data})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const updateCart = async function(req,res){
    try{
        let userId= req.params.userId
        let {cartId,productId,removeProduct}=req.body
        if(!isValidRequestBody(req.body)){
            return res.status(400).send({status : false, message : "Please provide data for updating cart"})
        }
        if(!isValidObjectId(userId)) return res.satus(400).send({status:false,message:"Please provide valid user Id"})
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message: "Please provide valid user" })
        }
        
        if (!productId)
          return res
            .status(400)
            .send({ status: false, message: "Please provide productId" });
    
        if(!isValidObjectId(productId)) return res.satus(400).send({status:false,message:"Please provide valid product Id"})
        let product = await productModel.findOne({_id:productId,isDeleted:false})
        if(!product){
            return res.status(404).send({ status: false, message: "There is no such product" })
        }
        if (!cartId)
          return res
            .status(400)
            .send({ status: false, message: "Please provide cartId" });
        if(!isValidObjectId(cartId)) return res.satus(400).send({status:false,message:"Please provide valid cart Id"}) 
        let cart = await cartModel.findById(cartId)
        if(!cart) {
            return res.status(404).send({ status: false, message: "Cart does not exist" })
        }
        if (cart.items.length == 0)
        return res.status(400).send({
          status: false,
          message: "Please add products in your cart",
        });
        if (!(removeProduct === 0 || removeProduct === 1))
          return res.status(400).send({
            status: false,
            message: "Please provide valid removeproduct ",
          });
        let items=cart.items
                
        for (let i = 0; i < items.length; i++) {
            if (items[i].productId == productId) {
                const priceChange = items[i].quantity * product.price;
                //when removeProduct is 0
                if (removeProduct == 0) {
                const productRemove = await cartModel.findOneAndUpdate({ _id: cartId },{$pull: { items: { productId: productId } },totalPrice: cart.totalPrice - priceChange,totalItems: cart.totalItems - 1,},{ new: true });
                return res.status(200).send({status: true,message: "Success",data: productRemove});
                }
                //when removeProduct is 1
                if (items[i].quantity == 1 && removeProduct == 1) {
                const priceUpdate = await cartModel.findOneAndUpdate({ _id: cartId },{$pull: { items: { productId: productId } },totalPrice: cart.totalPrice - priceChange,totalItems: cart.totalItems - 1,},{ new: true });
                return res.status(200).send({status: true,message: "Success",data: priceUpdate});
                }
                // decrease the products quantity by 1
                items[i].quantity = items[i].quantity - 1;
                const updatedCart = await cartModel.findByIdAndUpdate(
                { _id: cartId },
                {
                    items: items,
                    totalPrice: cart.totalPrice - product.price,
                },
                { new: true }
                );
                return res.status(200).send({
                status: true,
                message: "Success",
                data: updatedCart,
                });
            }
        }
      
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}
const getCart = async function(req,res){
    try{
        let userId=req.params.userId
        if(!isValidObjectId(userId)) return res.satus(400).send({status:false,message:"Please provide valid user Id"})
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
        if(!isValidObjectId(userId)) return res.satus(400).send({status:false,message:"Please provide valid user Id"})
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
        let deletedCartDetail = await cartModel.findOneAndUpdate({_id:cart._id},cart,{new:true})
        // console.log(deletedCartDetail)
        return res.status(200).send({status:true, message: "Detail of cart of this user",data:cart})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

module.exports ={createCart,getCart,updateCart,delCart}