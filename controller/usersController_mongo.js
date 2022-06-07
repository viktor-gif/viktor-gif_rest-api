'use strict'

const response = require('../response')
const db = require('../settings/db_mongo')

var express = require('express');
var router = express.Router();
const User = require('../models/user')
const HttpError = require('../error');
const { ConnectionPoolClearedEvent } = require('mongodb');
const fs = require('fs')

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
    }
  })
  user.save((err, users) => {
    if (err) {
      if (err.message.includes('email')) {
        response.status('Вибачте, такий email уже існує', res, 403)
      } else if (err.message.includes('login')) {
        response.status('Вибачте, такий login уже існує', res, 403)
      } else {
        next(err)
      }
      
    } else {
      // console.log(res)
      console.log(users);
      response.status(users, res, 200)
    }
      
  })
  
};
exports.userProfile = (req, res, next) => {
  User.findById(req.params.userId,
    'fullName lookingForAJobDescription aboutMe lookingForAJob photos location contacts created',
    (err, user) => {
    
    if (!user) {
      console.log(err)
      next(new HttpError(404, "Такого користувача не існує"))
    } else {
      if (err) console.log(err)
      res.json(user)
      
    }
    
  })
};
exports.userStatus = (req, res, next) => {
  User.findById(req.params.userId, 'status', (err, user) => {
    
    if (!user) {
      console.log(err)
      next(new HttpError(404, "Такого користувача не існує"))
    } else {
      if (err) console.log(err)
      res.json(user)
      
    }
    
  })
};
exports.updateStatus = (req, res, next) => {
  
  User.findOneAndUpdate({_id: req.session.userId}, {status: req.body.status}, (err, user) => {
    
    if (err) next(err)

    res.json(res.data)
    
  })
};
exports.updateProfile = (req, res, next) => {
  console.log(req.body.data)
  User.findOneAndUpdate({ _id: req.session.userId }, {
    fullName: req.body.data.fullName,
    aboutMe: req.body.data.aboutMe,
    lookingForAJobDescription: req.body.data.lookingForAJobDescription,
    lookingForAJob: req.body.data.lookingForAJob,
    location: {
      country: req.body.data.country,
      city: req.body.data.city,
    },
    contacts: {
      github: req.body.data.github,
      facebook: req.body.data.facebook,
      instagram: req.body.data.instagram,
      twitter: req.body.data.twitter,
      website: req.body.data.website,
      youtube: req.body.data.youtube,
      linkedin: req.body.data.linkedin,
    }
    
  }, (err, user) => {
    
    if (err) next(err)

    res.json(res.data)
    
  })
};

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
    if (err) return next(err)

    if (user) {
      console.log(user.checkPassword(password))
      if (user.checkPassword(password)) {
        console.log('Within')
        
      } else {
        next(new HttpError(403, "Пароль не вірний"))
      }
      console.log(req.session)
      console.log(user.login)
      req.session.userId = user._id
      req.session.email = user.email
      req.session.login = user.login
      res.send("Hello from session")
    } else {
      if (err) return next(err)
      
    }
    // next(new HttpError(403, "email або login не вірний"))
    
  })
};
