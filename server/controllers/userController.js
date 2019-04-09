const { User } = require("../models")
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(CLIENT_ID);
const { bcrypt, jwt } = require("../helpers")
const randomstring = require("randomstring")

class UserController {
  static getAllUsers(req, res) {
    User.find({
      email: {
        $ne: req.authenticatedUser.email
      }
    }, "_id name")
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static userLogin(req, res) {
    User.findOne({
      email: req.body.email
    })
    .then(foundUser => {
      if (!foundUser) {
        res.status(404).json({
          message: "Email not found"
        })
      }
      else if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        const token = jwt.sign({
          id: foundUser._id,
          email: foundUser.email,
          name: foundUser.name
        })

        res.status(200).json({
          token,
          id: foundUser._id,
          name: foundUser.name
        })
      }
      else {
        res.status(401).json({
          message: "Wrong username/password"
        })
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }

  static userRegister(req, res) {
    User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    })
    .then(createdUser => {
      const token = jwt.sign({
        id: createdUser._id,
        email: createdUser.email,
        name: createdUser.name
      })

      res.status(200).json({ token })
    })
    .catch(err => {
      if (err.errors.email || err.errors.name || err.errors.password) {
        res.status(400).json({
          message: err.message
        })
      }
      else {
        res.status(500).json(err)
      }
    })
  }

  static googleAuth(req, res) {
    let payload = null
    client.verifyIdToken({
      idToken: req.body.idToken,
      audience: CLIENT_ID
    })
    .then(ticket => {
      payload = ticket.getPayload();

      return User.findOne({
        email: payload.email
      })
    })
    .then(foundUser => {
      if (!foundUser) {
        return User.create({
          email: payload.email,
          name: payload.name,
          password: randomstring.generate(),
        })
      }
      else {
        return foundUser
      }
    })
    .then(user => {
      const token = jwt.sign({
        id: user._id,
        email: user.email,
        name: user.name
      })

      res.status(200).json({
        token,
        id: user._id,
        name: user.name
      })
    })
    .catch(err => {
      res.status(500).json(err)
    })
  }
}

module.exports = UserController