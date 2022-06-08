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
    
  }, {new: true}, (err, user) => {
    
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
exports.logout = (req, res, next) => {
  req.session.destroy()
  console.log("Delete one user");
}

exports.setFollow = async(req, res, next) => {
  if (req.session.userId) {

    let newOwnerFollowersArray = []
    let newFriendFollowersArray = []

    const owner = await User.findById(req.session.userId)
    const friend = await User.findById(req.query.userId)

    let isOwnerInDbUser = false
    let isUserInDbOwner = false
    
    await owner.followers.forEach(a => {
      if (a.userId == friend._id) isUserInDbOwner = true
      console.log(a.friendStatus + ' query-for-answer');
      console.log(a.userId == friend._id && a.friendStatus == 'query-for-answer')
      if (a.userId == friend._id && a.friendStatus == 'query-for-answer') {
        console.log('WITHIN A DFJDKFDKFDFJD');
        newOwnerFollowersArray.push({userId: a.userId, friendStatus: 'followed'})
      } else {
        newOwnerFollowersArray.push({userId: a.userId, friendStatus: a.friendStatus})
      }
      
    });
    await friend.followers.forEach(a => {
      if (a.userId == owner._id) isOwnerInDbUser = true
      console.log(a.friendStatus + ' pending-for-answer');
      console.log(a.userId == owner._id && a.friendStatus == 'pending-for-answer')
      if (a.userId == owner._id && a.friendStatus == 'pending-for-answer') {
console.log('WITHIN A DFJDKFDKFDFJD');
        newFriendFollowersArray.push({ userId: a.userId, friendStatus: 'followed' })
      } else {
        newFriendFollowersArray.push({ userId: a.userId, friendStatus: a.friendStatus })
      }
    });
    
    !isUserInDbOwner && newOwnerFollowersArray.push({ userId: req.query.userId, friendStatus: 'pending-for-answer' })
    !isOwnerInDbUser && newFriendFollowersArray.push({ userId: owner._id, friendStatus: 'query-for-answer' })

      User.findOneAndUpdate({ _id: req.session.userId },
        { followers: newOwnerFollowersArray },
        (err, user) => {
    
        if (err) next(err)
        res.json(res.data)
    
        })
      User.findOneAndUpdate({ _id: friend._id },
        { followers: newFriendFollowersArray },
        (err, user) => {
        
        if (err) next(err)
        res.json(res.data)
  
      })
    
  }
}