const { Todo, User } = require("../models")
const ObjectId = require('mongodb').ObjectID

class TodoController {
  static getTodos(req, res) {
    User.findOne({
      email: req.authenticatedUser.email
    }, "todos")
    .populate({
      path: 'todos',
      select: 'createdAt updatedAt name description dueDate',
      match: { status: false },
      options: {
        sort: {
          dueDate: 1 }
      }
    })
    .then(({todos}) => {
      res.status(200).json(todos)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static getDoneTodos(req, res) {
    User.findOne({
      email: req.authenticatedUser.email
    }, "todos")
    .populate({
      path: 'todos',
      select: 'createdAt updatedAt name description dueDate',
      match: { status: true },
      options: {
        sort: {
          dueDate: 1 }
      }
    })
    .then(({todos}) => {
      res.status(200).json(todos)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static getSomeonesTodo(req, res) {
    User.findOne({
      _id: req.params.userId
    }, "name todos")
    .populate({
      path: 'todos',
      select: 'createdAt updatedAt name description dueDate completedAt',
      match: { status: false },
      options: {
        sort: {
          dueDate: 1 }
      }
    })
    .then(foundUser => {
      res.status(200).json(foundUser)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static createATodo(req, res) {
    Todo.create({
      name: req.body.name,
      description: req.body.description,
      dueDate: req.body.dueDate,
      UserId: ObjectId(req.params.userId)
    })
    .then(createdTodo => {
      return User.findByIdAndUpdate(createdTodo.UserId, {
        $push: {
          todos: createdTodo._id
        }
      }, { new: true })
      .populate({
        path: "todos"
      })
    })
    .then(updatedUser => {
      res.status(201).json(updatedUser)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static deleteATodo(req, res) {
    Todo.deleteOne({
      _id: req.params.todoId
    })
    .then(() => {
      res.status(200).json({
        message: "delete success"
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static updateATodo(req, res) {
    Todo.findByIdAndUpdate(req.params.todoId, {
      name: req.body.name,
      dueDate: req.body.dueDate,
      description: req.body.description,
      updatedAt: new Date()
    }, {new: true})
    .then(updatedTodo => {
      res.status(200).json(updatedTodo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static markATodoAsDone(req, res) {
    Todo.findByIdAndUpdate(req.params.todoId, {
      status: true,
      updatedAt: new Date()
    }, {new: true})
    .then(updatedTodo => {
      res.status(200).json(updatedTodo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static markATodoAsOutstanding(req, res) {
    Todo.findByIdAndUpdate(req.params.todoId, {
      status: false,
      updatedAt: new Date()
    }, {new: true})
    .then(updatedTodo => {
      res.status(200).json(updatedTodo)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
}

module.exports = TodoController