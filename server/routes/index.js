const router = require("express").Router()
const UserController = require("../controllers/userController")

router.post("/user/login", UserController.userLogin)
router.post("/user/register", UserController.userRegister)
router.post("/user/google-sign-in", UserController.googleAuth)

module.exports = router