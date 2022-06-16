'use strict'

const response = require('../response')
const db = require('../settings/db_mongo')

var express = require('express');
var router = express.Router();
const User = require('../models/user').user
const HttpError = require('../error');
const { ConnectionPoolClearedEvent } = require('mongodb');
const fs = require('fs')
const path = require('path');
const { is } = require('express/lib/request');



exports.me = (req, res, next) => {
  console.log(req.session.userId, req.session.email, req.session.login)
  res.json({
    id: req.session.userId,
    email: req.session.email,
    login: req.session.login,
  })
}
exports.login = (req, res, next) => {
  const email = req.query.email
  const login = req.query.login
  const password = req.query.password
  console.log(login, email, password)

  User.findOne({ login, email }, (err, user) => {
    let error = null
    let statusCode = 200
    let data = null
    if (err) {
      error = err.message
      statusCode = err.code
    }

    if (user) {
      if (user.checkPassword(password)) {
        
      } else {
        error = "Пароль не вірний"
        statusCode = 403
      }
      req.session.userId = user._id
      req.session.email = user.email
      req.session.login = user.login
    } else {
      if (err) {
        error = err.message
        statusCode = err.code
      }
      
    }
    res.status(statusCode).json({
      statusCode,
      error,
      data
    })
    // next(new HttpError(403, "email або login не вірний"))
    
  })
};
exports.logout = (req, res, next) => {
  req.session.destroy()
  console.log("Delete one user");
}

