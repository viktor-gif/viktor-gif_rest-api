'use strict'
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')



exports.me = async (req, res, next) => {
  try {
    if (req.session.userId) {
      res.status(200).json({
        id: req.session.userId,
        email: req.session.email,
        login: req.session.login,
      })
    } else {
      res.status(403).json({
        message: "Вибачте, ви не авторизовані"
      })
    }
  } catch (err) {
    errorHandler(res, err)
  }
}
// exports.login = async(req, res, next) => {
//   const candidate = await User.findOne({ email: req.query.email })

//   const email = req.query.email
//   const login = req.query.login
//   const password = req.query.password

//   if (candidate) {

//     if (candidate.checkPassword(password)) {
//       const token = jwt.sign({
//         email: candidate.email,
//         login: candidate.login,
//         userId: candidate._id
//       }, config.get('jwt'), {expiresIn: 60 * 60})
//       res.status(200).json({
//         token: `Bearer ${token}`
//       })
//     } else {
//       res.status(401).json({
//         message: 'Вибачте, пароль не вірний. Спробуйте ще раз.'
//       })
//     }

//   } else {
//     res.status(404).json({
//       message: 'Користувача з таким e-mail не існує'
//     })
//   }
// };
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

        res.status(200).json({
          statusCode: 0,
          data: []
        })
      } else {
        res.status(403).json({
          message: "Пароль не вірний"
        })
      }
    } else {
      res.status(404).json({
        message: "Такого користувача не існує"
      })
    }
    
  } catch (err) {
    errorHandler(res, err)  
  }
};
exports.logout = async (req, res, next) => {
  try {
    req.session.destroy()
    res.status(200).json({
      message: "Ви вийшли зі свого аккаунта"
    })
  } catch (err) {
    errorHandler(res, err)
  }
}

