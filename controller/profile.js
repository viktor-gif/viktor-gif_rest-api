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
    
  }, {new: true}, (err, user) => {
    
    if (err) next(err)

    res.json(res.data)
    
  })
};

