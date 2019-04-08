const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcryptjs")

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "email cannot be empty"],
    validate: [{
      validator: function isUnique(email) {
        return User.findOne({
          email
        })
        .then(foundUser => {
          if (foundUser) {
            return false
          }
        })
      },
      message: "email is already registered"
    }, {
      validator: function isEmail(email) {
        let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regexEmail.test(email)
      },
      message: "email must be in a valid format"
    }]
  },
  name: {
    type: String,
    required: [true, "name cannot be empty"],
    validate: [{
      validator: function isAlpha(name) {
        let alphaRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
        return alphaRegex.test(name)
      },
      message: "your name must be in a valid format"
    }]
  },
  password: {
    type: String,
    required: [true, "password cannot be empty"]
  },
  todos: [{
    type: Schema.Types.ObjectId,
    ref: "Todo"
  }]
})

userSchema.pre("save", function(next) {
  let user = this

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(user.password, salt);

  user.password = hash
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User