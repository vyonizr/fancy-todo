const mongoose = require("mongoose")
const { Schema } = mongoose
const moment = require("moment")

const todoSchema = new Schema({
  name: {
    type: String,
    required: [true, "todo name is required"]
  },
  description: {
    type: String,
    required: [true, "todo description is required"]
  },
  status: {
    type: Boolean,
    default: false,
    enum: [true, false]
  },
  dueDate: {
    type: Date,
    required: [true, "todo due date is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  UserId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

const Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo