const mongoose= require("mongoose")

const productSchema= new mongoose.Schema({
    title: {
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true   //valid number/decimal
    },
    currencyId:{
        type:String,
        required:true   //INR
    },
    currencyFormat:{
        type:String,
        required:true   //Rupee symbol
    },
    isFreeShipping:{
        type:Boolean,
        default:false
    },
    productImage:{      // s3 link
        type:String,
        required:true
    },
    style:String,
    availableSizes:{
        type:[String],
        enum:["S", "XS","M","X", "L","XXL", "XL"]
    },
    installments:Number,
    deletedAt:{
        type:Date,
        default:null
    }, //when the document is deleted
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model("product",productSchema)
