'use strict';

const mongoose = require('mongoose');
const jwt      = require('jwt-simple');
const bcrypt   = require('bcryptjs');
const moment   = require('moment');
const CONFIG   = require('../config/authConfig');

let Schema = mongoose.Schema;
let User;

let userSchema = Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  roles:[String]
});

userSchema.methods.token = function() {
  let payload = {
    id: this._id,
    iat: moment().unix(),
    exp: moment().add(CONFIG.expTime.num, CONFIG.expTime.unit).unix()
  };
  return jwt.encode(payload, process.env.JWT_SECRET);
};

userSchema.statics.login = function(userInfo, cb) {
  // look for user in database
  User.findOne({username: userInfo.username}).exec(function (err, foundUser) {
    if (err) return cb('server error');
    if (!foundUser) return cb('incorrect username or password');
    bcrypt.compare(userInfo.password, foundUser.password, function (err, isGood) {
      if (err) console.log("bcrypt error");
      if (err) return cb('server err');
      if (isGood) {
        return cb(null, foundUser);
      } else {
        return cb('incorrect username or password');
      }
    });
  });
}

userSchema.statics.register = function(userInfo, cb) {
  let username  = userInfo.username
    , password  = userInfo.password
    , password2 = userInfo.password2;

  // compare passwords
  if (password !== password2) {
    return cb("passwords don't match");
  }

  // validate password
  if (!CONFIG.validatePassword(password)) {
    return cb('invalid password');
  }

  // validate username
  if (!CONFIG.validateUsername(username)) {
    return cb('invalid username');
  }

  // create user model
  User.findOne({username: username}, function (err, user) {
    if (err) return cb('error registering username');
    if (user) return cb('username taken');
    bcrypt.genSalt(CONFIG.saltRounds, (err, salt) => {
      if (err) return cb(err);
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) return cb(err);
        let newUser = new User({
          username: username,
          password: hashedPassword
        });
        newUser.save((err, savedUser) => {
          return cb(err, savedUser);
        })
      });
    });
  })
};

User = mongoose.model('User', userSchema);
module.exports = User;