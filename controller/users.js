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
  let totalCount = null
  let error = null
  let statusCode = 200

  let limit = req.query.pageSize || 10
  let skip = req.query.pageNumber ? req.query.pageNumber * limit - limit : 0
  let term = req.query.term || ''

  const users = User.find()
  users.count((err, count) => {
    if (err) {
      statusCode = err.code
      error = err.message
    }
    totalCount = count;
  })

    const regex = new RegExp(term, "i")
User.find({fullName: regex}, 'fullName status photos location', (err, users) => {
    if (err) {
      statusCode = err.code
      error = err.message
    } else {
      res.status(statusCode).json({
        items: users.map(u => {
          return {
            id: u._id.toString(),
            fullName: u.fullName,
            status: u.status,
            location: u.location,
            photos: u.photos
          }
        }),
        totalCount,
        error: error
      })
      // response.status(users, res)
    }
  }).limit(limit).skip(skip)
    
  // })
    
};
exports.add = (req, res, next) => {
  let statusCode = 200
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
      response.status(null, res, 200)
    }
      
  })
  
}


