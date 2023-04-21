'use strict'
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')
const path = require('path')
const fs = require('fs')
const userErrorHandler = require('../utils/userErrorHandler')

/* GET users listing. */
exports.users = async (req, res, next) => {
  try {


    const authUser = await User.findById(req.session.userId)
    const authFollowers = authUser.followers


    const authFriends = authFollowers.filter(f => f.friendStatus === 'followed')
    const authFriendsIds = authFriends.map(f => f.userId)
    const userFriendsQuery = authFollowers.filter(f => f.friendStatus === 'query-for-answer')
    const authFriendsQuery = authFollowers.filter(f => f.friendStatus === 'pending-for-answer')

    let totalCount = null
    let error = null

    let limit = req.query.pageSize || 10
    let skip = req.query.pageNumber ? req.query.pageNumber * limit - limit : 0
    let term = req.query.term || ''
    let friendStatus = req.query.friendStatus || "all"

    User.find().count((err, count) => {
      if (err) {
        errorHandler(res, err)
      }
      totalCount = count;
    })

    const regex = new RegExp(term, "i")
    // const users = await User.find({ fullName: regex }, 'fullName status photos location followers').limit(limit).skip(skip)

    const authUserFollowersMapped = authUser.followers.map(f => {
      return f.userId + f.friendStatus

    })

    let users
    // let filteredUsers
    if (friendStatus === "all") {
      users = await User.find({ fullName: regex }, 'fullName status photos location followers').limit(limit).skip(skip)

    } else if (friendStatus === "friends") {

      users = await User.find({ fullName: regex }, 'fullName status photos location followers').limit(limit).skip(skip)
      users = users.filter(u => authUserFollowersMapped.includes(u.id + 'followed'))
      totalCount = authFriends.length

      // let arr = []

      // authFriendsIds.forEach(async (f) => {
      //     User.find({
      //       fullName: regex,
      //       _id: f
      //     }, 'fullName status photos location followers').limit(limit).skip(skip)
      //     .then(user => arr.push({a: 'test'}))
      // })
      
      // console.log(arr)
      // users = await User.find({
      //   fullName: regex,
      //   _id: '62b58beda8b5726e3fe3e691',
      //   _id: '62b58bdba8b5726e3fe3e689'
      // }, 'fullName status photos location followers').limit(limit).skip(skip)
      // users = users.filter(u => authUserFollowersMapped.includes(u.id + 'followed'))
      // totalCount = authFriends.length

    } else if (friendStatus === "followers") {
      users = await User.find({ fullName: regex }, 'fullName status photos location followers').limit(limit).skip(skip)
      users = users.filter(u => authUserFollowersMapped.includes(u.id + 'query-for-answer'))
      totalCount = userFriendsQuery.length

    } else if (friendStatus === "followed") {
      users = await User.find({ fullName: regex }, 'fullName status photos location followers').limit(limit).skip(skip)
      
      users = users.filter(u => authUserFollowersMapped.includes(u.id + 'pending-for-answer'))
      console.log('_________fffffff')
      console.log(users)
      totalCount = authFriendsQuery.length
    }

    if (users) {
      res.status(200).json({
        items: users.map(u => {
          // console.log(authUser.followers.filter(f => f.userId == u._id))
          return {
            id: u._id.toString(),
            fullName: u.fullName,
            status: u.status,
            location: u.location,
            photos: u.photos,
            followers: u.followers
          }
        }),
        totalCount,
        error: error
      })
    } else {
      res.status(404).json({
        message: "Таких користувачів не існує"
      })
    }
  } catch (err) {
    errorHandler(res, err)
  }
};

exports.deleteUser = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try{
      User.findOneAndUpdate({_id: req.session.userId}, {blockedAccaunt: true}, (err, user) => {
    
        if (err) errorHandler(res, err)

        res.status(204).json({
          resultCode: 0,
          data: req.session.userId
        })
    
      })
    } catch (err) {
      errorHandler(res, err)
    }
  }
};
exports.restoreUser = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try{
      User.findOneAndUpdate({_id: req.session.userId}, {blockedAccaunt: false}, (err, user) => {
    
        if (err) errorHandler(res, err)

        res.status(201).json({
          resultCode: 0,
          data: req.session.userId
        })
    
      })
    } catch (err) {
      errorHandler(res, err)
    }
  }
};

exports.add = async (req, res, next) => {
  const candidate = await User.findOne({ email: req.query.email })

  if (candidate) {
    userErrorHandler(res, 409, 'Такий email вже зайнятий. Спробуйте другий.')
  } else {
    // const salt = bcrypt.getSaltSync(10)
    // const password = req.body.password

    // this is password with bcrypt
    // password: bcrypt.hashSync(req.query.password, salt),

    
    try {

      const user = new User({
        fullName: req.query.fullName,
        password: req.query.password,
        email: req.query.email,
        location: {
          country: "USA",
          city: "New-York"
        },
        followers: {
          userId: '1111',
          friendStatus: 'unfollowed'
        }
      })

      const pathName = path.join(__dirname.slice(0, -10), 'files', 'images', 'avatar', user._id.toString())
      console.log('PATH___________: ' + pathName);
      fs.mkdir(pathName, (err, data) => {
        if (err) errorHandler(res, err)
      })
      await user.save()
      res.status(201).json({
        data: user,
        resultCode: 0
      })
    } catch (err) {
      errorHandler(res, err)
    }
  }
}









exports.test__1 = async (req, res, next) => {
  
  const users = await User.find()
  
  res.status(200).json(users)
};

