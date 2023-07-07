const express= require("express")
const router= express.Router()
const {registerUser,loginUser,getUser,updateUser}= require("../controller/userController")
const authenticate= require("../middleware/authentication")
const authorise= require("../middleware/authorization")
const {createProduct,getProduct,getProductById,updateProduct,delProduct}= require("../controller/productController")
const {createCart,updateCart,getCart,delCart}= require("../controller/cartController")
const {createOrder,updateOrder}=require("../controller/orderController")

//User API

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authenticate,authorise,getUser)
router.put("/user/:userId/profile",authenticate,authorise,updateUser)


//Product API

router.post("/products",createProduct)
router.get("/products",getProduct)
router.get("/products/:productId",getProductById)
router.put("/products/:productId",updateProduct)
router.delete("/products/:productId",delProduct)

//Cart API

router.post("/users/:userId/cart",createCart)
router.put("/users/:userId/cart",updateCart)
router.get("/users/:userId/cart",getCart)
router.delete("/users/:userId/cart",delCart)

//OrderAPI

router.post("/users/:userId/orders",authenticate,authorise,createOrder)
router.put("/users/:userId/orders",authenticate,authorise,updateOrder)
module.exports = router