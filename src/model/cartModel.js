const mongoose= require("mongoose")

const cartSchema= new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true,
        unique:true
    },
    items:[
        {
            productId: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: 'Product', required: true 
                },
            quantity: {
                 type: Number,
                 required: true,
                 min: 1 }
          }
    ],
    totalPrice:{
        type:Number,
        required:true
    },
    totalItems:{
        type:Number,
        required:true
    }
})

module.exports =mongoose.model("cart",cartSchema)

// userId: {ObjectId, refs to User, mandatory, unique},
//   items: [{
//     productId: {ObjectId, refs to Product model, mandatory},                 //need confirmation
//     quantity: {number, mandatory, min 1}
//   }],
//   totalPrice: {number, mandatory, comment: "Holds total price of all the items in the cart"},
//   totalItems: {number, mandatory, comment: "Holds total number of items in the cart"},