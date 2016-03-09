'use strict';

const express = require('express');
const User = require('../models/userModel');
const checkAuthStatus = require('../Util/checkAuthStatus');

const router = express.Router();

router.get('/', checkAuthStatus, function (req, res) {
  res.status(200).send();
});

router.post('/register', function (req, res) {
  User.register(req.body, function (err, user) {
    res.status(err ? 400 : 200).send(err || "Registered!");
  })
});

router.post('/login', function (req, res) {
  User.login(req.body, function (err, user) {
    if (err) {
      res.status(400).send(err);
      return;
    }

    let token = user.token();
    user = user.toObject();
    delete user.password;
    res.status(200).send({token:token, user: user});
  })
});

module.exports = router;
