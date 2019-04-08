const router = require("express").Router()
const { UserController } = require("../controllers/")
const isAuthenticated = require("../middlewares/isAuthenticated")

router.get("/", isAuthenticated, UserController.getAllUsers)
router.post("/login", UserController.userLogin)
router.post("/register", UserController.userRegister)
router.post("/google-sign-in", UserController.googleAuth)

module.exports = router