'use strict'
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')

exports.me = async (req, res, next) => {

  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId)
      res.status(200).json({
        data: {
          id: req.session.userId,
          email: req.session.email,
          login: req.session.login,
          blockedAccaunt: user.blockedAccaunt
        },
        resultCode: 0
      })
    } else {
      userErrorHandler(res, 403, "Вибачте, ви не авторизовані")
    }
  } catch (err) {
    errorHandler(res, err)
  }
}

exports.login = async (req, res, next) => {
  const email = req.query.email
  const password = req.query.password

  try{
    const user = await User.findOne({ email })
    const isBlockedAccaunt =  user?.blockedAccaunt

    if (user) {
      if (user.checkPassword(password)) {
        req.session.userId = user._id
        req.session.email = user.email
        req.session.login = user.login

        res.status(200).json({
          resultCode: 0,
          data: {
            isBlockedAccaunt,
            userId: user._id
          }
        })
      } else {
        userErrorHandler(res, 404, "Пароль або e-mail вказані не вірно")
      }
    } else {
      userErrorHandler(res, 404, "Пароль або e-mail вказані не вірно")
    }
    
  } catch (err) {
    errorHandler(res, err)  
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.session.destroy()
    res.status(200).json({
      resultCode: 0,
      data: {}
    })
  } catch (err) {
    errorHandler(res, err)
  }
}

