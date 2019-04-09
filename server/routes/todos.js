const router = require("express").Router()
const { TodoController } = require("../controllers/")
const { isAuthenticated, isAuthorized } = require("../middlewares/")

router.get("/", isAuthenticated, TodoController.getTodos)
router.get("/done", isAuthenticated, TodoController.getDoneTodos)
router.post("/:userId/create", isAuthenticated, TodoController.createATodo)
router.patch("/:todoId", isAuthenticated, isAuthorized, TodoController.updateATodo)
router.patch("/:todoId/done", isAuthenticated, isAuthorized, TodoController.markATodoAsDone)
router.patch("/:todoId/outstanding", isAuthenticated, isAuthorized, TodoController.markATodoAsOutstanding)
router.delete("/:todoId", isAuthenticated, isAuthorized, TodoController.deleteATodo)
router.get("/:userId", isAuthenticated, TodoController.getSomeonesTodo)

module.exports = router