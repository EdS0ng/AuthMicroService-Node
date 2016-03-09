'use strict';

const jwt    = require('jwt-simple');
const moment = require('moment');
const CONFIG = require('../config/authConfig');
const User   = require('../models/userModel');

module.exports = function(req, res, next) {
  console.log("authenticating...");
  if (!req.headers.authorization) {
    return res.status(401).send('authorization required');
  }

  let token = req.headers.authorization.replace('Bearer ', '');

  try {
    var decoded = jwt.decode(token, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(401).send('authorization required');
  }

  if (decoded.exp < moment().unix()) {
    return res.status(401).send('authorization expired');
  }

  if (CONFIG.refreshToken) {
    User.findById(decoded.id, (err, user) => {
      if (err) return res.status(400).send('server error');
      if (!user) return res.status(401).send('authorization required');
      req.userId = decoded.id;
      res.set('Authorization', `Bearer ${user.token()}`)
      next();
    });
  } else {
    req.userId = decoded.id;
    next();
  }
};