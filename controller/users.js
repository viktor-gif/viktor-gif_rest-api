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

/* GET users listing. */
exports.users = (req, res, next) => {
  User.find({}, 'fullName status photos location', (err, users) => {
    if (err) {
      return next(err)
    } else {
      res.json(users)
      // response.status(users, res)
    }
  }).limit(10)
};
exports.add = (req, res, next) => {
  console.log(req.query)
  const user = new User({
    fullName: req.query.fullName,
    password: req.query.password,
    email: req.query.email,
    login: req.query.login,
    location: {
      country: "USA",
      city: "New-York"
    },
    followers: {
      userId: '1111',
      friendStatus: 'unfollowed'
    }
  })
  user.save((err, user) => {
    if (err) {
      if (err.message.includes('email')) {
        response.status('Вибачте, такий email уже існує', res, 403)
      } else if (err.message.includes('login')) {
        response.status('Вибачте, такий login уже існує', res, 403)
      } else {
        next(err)
      }
      
    } else {
      const pathName = path.join(__dirname.slice(0, -10), 'files', 'images', 'avatar', user._id.toString())
      console.log('PATH___________: ' + pathName);
      fs.mkdir(pathName, (err, data) => {
        if (err) console.log(err);
      })
      console.log(res)
      console.log(user);
      response.status(user, res, 200)
    }
      
  })
  
}


