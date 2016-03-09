'use strict';

module.exports = {
  expTime: {num: 7, unit: 'days'},
  refreshToken: false,
  saltRounds: 10,
  validatePassword: function (password) {
    //add rules for password validation
    return password.length >= 3;
  },
  validateUsername: function (username) {
      //add rulse for username validation
      return username.length >= 3;
  }
};