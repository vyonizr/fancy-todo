const router = require("express").Router()
const { UserController, TodoController } = require("../controllers/")
const isAuthenticated = require("../middlewares/isAuthenticated")
const {User} = require("../models")

// router.get("/users/", (req, res) => {
//   User.find({})
//   .populate({
//     path: "todos"
//   })
//   .then(users => {
//     res.status(200).json(users)
//   })
//   .catch(err => {
//     res.status(500).json(err)
//   })todoId
// })
router.post("/users/login", UserController.userLogin)
router.post("/users/register", UserController.userRegister)
router.post("/users/google-sign-in", UserController.googleAuth)
router.get("/todos", isAuthenticated, TodoController.getTodos)
router.post("/todos/:userId/create", isAuthenticated, TodoController.createATodo)
router.patch("/todos/:todoId", isAuthenticated, TodoController.updateATodo)
router.patch("/todos/:todoId/done", isAuthenticated, TodoController.markATodoAsDone)
router.delete("/todos/:todoId", isAuthenticated, TodoController.deleteATodo)

module.exports = router