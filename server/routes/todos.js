const router = require("express").Router()
const { TodoController } = require("../controllers/")
const isAuthenticated = require("../middlewares/isAuthenticated")

router.get("/", isAuthenticated, TodoController.getTodos)
router.get("/done", isAuthenticated, TodoController.getDoneTodos)
router.post("/:userId/create", isAuthenticated, TodoController.createATodo)
router.patch("/:todoId", isAuthenticated, TodoController.updateATodo)
router.patch("/:todoId/done", isAuthenticated, TodoController.markATodoAsDone)
router.delete("/:todoId", isAuthenticated, TodoController.deleteATodo)
router.get("/:userId", isAuthenticated, TodoController.getSomeonesTodo)

module.exports = router