const productModel= require("../model/productModel")
const multer= require("multer")
const {isValidNum,isValidCurrFor,isValidString, isValidObjectId}=require("../util/validations")
const {uploadFile} =require("../util/aws")

const createProduct = async function(req,res){
    try{
        let {title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments,deletedAt,isDeleted}=req.body
        let files=req.files
        if(!(title) || !(isValidString(title))){
            return res.status(400).send({status: false, message : "Please provide title (in valid format)"})
        }
        //unique title
        let duplicateTitle= await productModel.findOne({title:title})
        if(duplicateTitle){
            return res.status(400).send({status: false, message : "Please provide unique title"})
        }
        if(!(description) || !(isValidString(description))){
            return res.status(400).send({status: false, message : "Please provide description (in valid format)"})
        }
        if(!(price) || !(isValidNum(price))){
            return res.status(400).send({status: false, message : "Please provide price (in valid format)"})
        }
        if(!(currencyId) || !(isValidString(currencyId))){
            return res.status(400).send({status: false, message : "Please provide currency Id(in valid format-`INR`)"})
        }
        if(!(currencyFormat) || !(isValidCurrFor(currencyFormat))){
            return res.status(400).send({status: false, message : "Please provide currency Format(in valid format-`₹`)"})
        }
        if(isFreeShipping){
            if(typeof isFreeShipping!="boolean"){
                return res.status(400).send({status: false, message : "Please provide isFreeShipping(in valid format-`₹`)"})
            }
        }

        if(!files||files.length==0){
            return res.status(400).send({status: false, message : "Please provide profile image"})
        }
        if(style){
            if(typeof style!="string")
            {
                return res.status(400).send({status: false, message : "Please provide style (in valid format)"})
            }
        }

        if(availableSizes){
            if(!["S", "XS","M","X", "L","XXL", "XL"].includes(availableSizes)){
                return res.status(400).send({status: false, message : "Please provide available sizes (in valid format)"})
            }
        }
        if(installments ){
            if(!isValidNum(installments)){
                return res.status(400).send({status: false, message : "Please provide installments (in valid format)"})
            }
        }
        if(deletedAt){
            if(typeof deletedAt!=Date){
                return res.status(400).send({status: false, message : "Please provide when it is deleted (in valid format)"})
            }
        }
        if(isDeleted){
            if(typeof isDeleted!="boolean"){
                return res.status(400).send({status: false, message : "Please provide if it is deleted or not(in valid format)"})
            }
        }
        //AWS-S3 link after uploading profileImage
        let profileImgUrl= await uploadFile(files[0]);
        req.body.productImage = profileImgUrl;
        let product= await productModel.create(req.body)
        return res.status(201).send({status:true, message: "Product is created",data:product})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}
const getProduct = async function(req,res){
    try{
        let {size,name,priceGreaterThan,priceLessThan,priceSort }= req.query
    let filter={}
    filter.isDeleted=false
    if(size){
        if(!["S", "XS","M","X", "L","XXL", "XL"].includes(size)){
            return res.status(400).send({status: false, message : "Please provide valid size"})
        }
       filter.availableSizes = { $in: size.split(",") };
    }
    if(name){
        if(!(isValidString(name))){
            return res.status(400).send({status: false, message : "Please provide valid title"})
        }
        filter.title = { $regex: name, $options: "i" };
    }
    if(priceGreaterThan){
        if(!isValidNum(priceGreaterThan)){
            return res.status(400).send({status: false, message : "Please provide valid number "})
        }
        filter.price={$gt:priceGreaterThan}
    }
    if(priceLessThan){
        if(!isValidNum(priceLessThan)){
            return res.status(400).send({status: false, message : "Please provide valid number "})
        }
        if(filter.price){
            filter.price.$lt=priceLessThan
        }
        else{
            filter.price={$lt:priceLessThan}
        }
    }
    let product=await productModel.find(filter).sort({price:priceSort})
    return res.status(200).send({status:true,message:"Here is the filtered data",data:product })
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const getProductById = async function(req,res){
    try{
        let productId=req.params
        // return res.send(typeof (productId)==="mongoose.Types.ObjectId")
        if(!isValidObjectId(productId)){
            return res.status(400).send({status: false, message : "Please provide valid product Id"})
        }
        
        let product= await productModel.findOne(
            {_id:productId,isDeleted:false}
        )
        console.log(product)
        return res.status(200).send({status:true,message:"Here is the product",data:product })

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }

}
const updateProduct = async function(req,res){
    try{
       let productId= req.params.productId
       let {title,description,price,currencyId,currencyFormat,isFreeShipping,style,availableSizes,installments}=req.body
       let files=req.files
       let update={}
       //valid product id
       if (!isValidObjectId(productId)) {
        return res.status(401).send({ status: false, message: "Invalid Product Id" })
        }
       //valid title
       if(title){
            if(!(isValidString(title))){
                return res.status(400).send({status: false, message : "Please provide title (in valid format)"})
            }
            //unique title
            let duplicateTitle= await productModel.findOne({title:title})
            if(duplicateTitle){
                return res.status(400).send({status: false, message : "Please provide unique title"})
            }
            update.title=title
       }
       //valid decription
       if(description){
            if(!(isValidString(description))){
                return res.status(400).send({status: false, message : "Please provide description (in valid format)"})
            }
            update.description=description
       }
       //price
       if(price){
            if(!(price) || !(isValidNum(price))){
                return res.status(400).send({status: false, message : "Please provide price (in valid format)"})
            }
            update.price=price
       }
       //currencyId
       if(currencyId){
            if(!(isValidString(currencyId))){
                return res.status(400).send({status: false, message : "Please provide currency Id(in valid format-`INR`)"})
            }
            update.currencyId=currencyId
       }
       //currencyFormat
       if(currencyFormat){
            if(!(isValidCurrFor(currencyFormat))){
                return res.status(400).send({status: false, message : "Please provide currency Format(in valid format-`₹`)"})
            }
            update.currencyFormat=currencyFormat
       }
       //isFreeShipping
       if(isFreeShipping){
            
                if(typeof isFreeShipping!="boolean"){
                    return res.status(400).send({status: false, message : "Please provide isFreeShipping(in valid format-`₹`)"})
                }
            
            update.isFreeShipping=isFreeShipping
       }
       //image validation check
       if((files[0])){
            if(files.length==0) return res.status(400).send({status: false, message : "Please provide profile image"})
            let profileImgUrl = await uploadFile(files[0]);
            update.profileImage = profileImgUrl;
        }
        //style
        if(style){
            if(typeof style!="string")
            {
                return res.status(400).send({status: false, message : "Please provide style (in valid format)"})
            }
            update.style=style
        }
        //availableSizes
        if(availableSizes){
            if(!["S", "XS","M","X", "L","XXL", "XL"].includes(availableSizes)){
                return res.status(400).send({status: false, message : "Please provide available sizes (in valid format)"})
            }
            update.availableSizes=availableSizes
        }
        //installments
        if(installments ){
            if(!isValidNum(installments)){
                return res.status(400).send({status: false, message : "Please provide installments (in valid format)"})
            }
            update.installments=installments
        }
        let updatedProduct= await productModel.findOneAndUpdate({_id: productId, isDeleted: false},update,{new:true})
        return res.status(200).send({ status: true, message: "User profile updated", data: updatedProduct })

    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
const delProduct = async function(req,res){
    try{
        let productId = req.params.productId
        //valid product id
        if (!isValidObjectId(productId)) {
        return res.status(401).send({ status: false, message: "Invalid Product Id" })
        }
        //product existence 
        let product = await productModel.findById(productId)
        if(!product){
            return res.status(400).send({status:false,message:"There is no product with this id"})
        }
        if(product.isDeleted==true){
            return res.status(400).send({status:false,message:"This product is already deleted"})
        }
        let delProd =await productModel.findOneAndUpdate({_id:product},{isDeleted:true,deletedAt:Date.now()})
        return res.status(200).send({status:true,messgae:"Deleted succesfully"})
    }
    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}
module.exports = {createProduct,getProduct,getProductById,updateProduct,delProduct}
