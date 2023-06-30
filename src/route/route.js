const express= require("express")
const router= express.Router()
const {registerUser,loginUser,getUser,updateUser}= require("../controller/userController")

//User API

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",getUser)
router.put("/user/:userId/profile",updateUser)

module.exports = router