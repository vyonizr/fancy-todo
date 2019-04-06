const mongoose = require("mongoose")
const { Schema } = mongoose
const moment = require("moment")
// console.log(moment(new Date()).format("YYYY/MM/DD"));

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
    default: new Date()
  },
  updatedAt: {
    type: Date,
    default: new Date()
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
})

const Todo = mongoose.model("Todo", todoSchema)

module.exports = Todo