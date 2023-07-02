<<<<<<< HEAD
const express= require("express")
const router= express.Router()
const {registerUser,loginUser,getUser,updateUser}= require("../controller/userController")
const authenticate= require("../middleware/authentication")
const authorise= require("../middleware/authorization")

//User API

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authenticate,authorise,getUser)
router.put("/user/:userId/profile",authenticate,authorise,updateUser)

=======
const express= require("express")
const router= express.Router()
const {registerUser,loginUser,getUser,updateUser}= require("../controller/userController")
const authenticate= require("../middleware/authentication")
const authorise= require("../middleware/authorization")

//User API

router.post("/register",registerUser)
router.post("/login",loginUser)
router.get("/user/:userId/profile",authenticate,authorise,getUser)
router.put("/user/:userId/profile",authenticate,authorise,updateUser)

>>>>>>> dea9d840748959539eb6cfac383a623845044cd1
module.exports = router