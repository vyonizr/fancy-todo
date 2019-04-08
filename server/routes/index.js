const router = require("express").Router()
const usersRoute = require("./users")
const todosRoute = require("./todos")

router.use("/users", usersRoute)
router.use("/todos", todosRoute)

module.exports = router