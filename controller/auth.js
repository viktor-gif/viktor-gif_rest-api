'use strict'
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')

exports.me = async (req, res, next) => {

  try {
    if (req.session.userId) {
      res.status(200).json({
        data: {
          id: req.session.userId,
          email: req.session.email,
          login: req.session.login,
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

    if (user) {
      if (user.checkPassword(password)) {
        req.session.userId = user._id
        req.session.email = user.email
        req.session.login = user.login

        successHandler(res, 200, "Ви залогінились")
      } else {
        userErrorHandler(res, 403, "Пароль не вірний")
      }
    } else {
      userErrorHandler(res, 404, "Такого користувача не існує")
    }
    
  } catch (err) {
    errorHandler(res, err)  
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.session.destroy()
    successHandler(res, 200, "Ви залишили свою сторінку")
  } catch (err) {
    errorHandler(res, err)
  }
}

