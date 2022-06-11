'use strict'

const response = require('../response')
const db = require('../settings/db_mongo')

var express = require('express');
var router = express.Router();
const User = require('../models/user').user
const HttpError = require('../error');
const { ConnectionPoolClearedEvent, LoggerLevel } = require('mongodb');
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



let userAvatarDirectory = null
exports.userAvatarDirectory = userAvatarDirectory


exports.updatePhoto = (req, res) => {
    console.log('9999999999999999999999999')
    const pathAvatar = path.join(__dirname.slice(0, -10), 'files/images/avatar', req.session.userId)
    console.log('fksdflsdfjskd: ' + pathAvatar)
    fs.readdir(pathAvatar, (err, files) => {
        if (err) throw err;

        for (const file of files) {
                if (file !== path.basename(req.file.path)) {
                    console.log('FILE: ' + file)
                    console.log('req.file.path____: ' + path.basename(req.file.path))
                fs.unlink(path.join(pathAvatar, file), (err) => {
                    if (err) throw err;
                    console.log('Картинка видалена');
                });
            }
        }
    })

        userAvatarDirectory = req.session.userId

        const photoUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path
        console.log('photourl: ' + photoUrl);
        try {
            if (req.file) {
                console.log(req.get('host'));
            console.log(photoUrl);
            console.log(req.originalUrl);
            console.log(req.file.path)
            
            res.json(req.file)
            
            User.findOneAndUpdate({ _id: req.session.userId }, {
                photos: {
                    large: photoUrl,
                    small: photoUrl,
                }
            
            }, (err, user) => {
            
                //if (err) next(err)

                res.json(res.data)
            })
            }
        } catch (err) {
            console.log(err);
        }
}


