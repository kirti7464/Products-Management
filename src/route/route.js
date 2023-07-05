const express= require("express")
const router= express.Router()
const {registerUser,loginUser,getUser,updateUser}= require("../controller/userController")
const authenticate= require("../middleware/authentication")
const authorise= require("../middleware/authorization")
const {createProduct,getProduct,getProductById,updateProduct,delProduct}= require("../controller/productController")
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
module.exports = router