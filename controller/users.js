'use strict'
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')
const path = require('path')
const fs = require('fs')

/* GET users listing. */
exports.users = async (req, res, next) => {
  try {
    const authUser = await User.findById(req.session.userId)
    let totalCount = null
    let error = null

    let limit = req.query.pageSize || 10
    let skip = req.query.pageNumber ? req.query.pageNumber * limit - limit : 0
    let term = req.query.term || ''
    let friendStatus = req.query.friendStatus || "followed"

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
      
    } else if (friendStatus === "followers") {
      users = await User.find({ fullName: regex }, 'fullName status photos location followers').limit(limit).skip(skip)
      users = users.filter(u => authUserFollowersMapped.includes(u.id + 'query-for-answer'))
      
    } else if (friendStatus === "followed") {
      users = await User.find({ fullName: regex }, 'fullName status photos location followers').limit(limit).skip(skip)
      users = users.filter(u => authUserFollowersMapped.includes(u.id + 'pending-for-answer'))
      
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
// exports.add = (req, res, next) => {
//   let statusCode = 200
//   const user = new User({
//     fullName: req.query.fullName,
//     password: req.query.password,
//     email: req.query.email,
//     login: req.query.login,
//     location: {
//       country: "USA",
//       city: "New-York"
//     },
//     followers: {
//       userId: '1111',
//       friendStatus: 'unfollowed'
//     }
//   })
//   user.save((err, user) => {
//     if (err) {
//       if (err.message.includes('email')) {
//         response.status('Вибачте, такий email уже існує', res, 403)
//       } else if (err.message.includes('login')) {
//         response.status('Вибачте, такий login уже існує', res, 403)
//       } else {
//         next(err)
//       }

//     } else {
//       const pathName = path.join(__dirname.slice(0, -10), 'files', 'images', 'avatar', user._id.toString())
//       console.log('PATH___________: ' + pathName);
//       fs.mkdir(pathName, (err, data) => {
//         if (err) console.log(err);
//       })
//       response.status(null, res, 200)
//     }

//   })

// }
exports.add = async (req, res, next) => {
  const candidate = await User.findOne({ email: req.query.email })

  if (candidate) {
    res.status(409).json({
      message: 'Такий email вже зайнятий. Спробуйте другий.'
    })
  } else {
    // const salt = bcrypt.getSaltSync(10)
    // const password = req.body.password

    // this is password with bcrypt
    // password: bcrypt.hashSync(req.query.password, salt),

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
    try {
      const pathName = path.join(__dirname.slice(0, -10), 'files', 'images', 'avatar', user._id.toString())
      console.log('PATH___________: ' + pathName);
      fs.mkdir(pathName, (err, data) => {
        if (err) console.log(err);
      })
      await user.save()
      res.status(201).json(user)
    } catch (err) {
      errorHandler(res, err)
    }
  }
}


