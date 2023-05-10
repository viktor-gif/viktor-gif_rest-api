'use strict'

const User = require('../models/user').user
const fs = require('fs')
const path = require('path');
const errorHandler = require('../utils/errorHandler');
const userErrorHandler = require('../utils/userErrorHandler');

exports.userProfile = async (req, res, next) => {
  const userId = req.params.userId
  try {
    if (!userId) {
      userErrorHandler(res, 401, "Вибачте, ви не авторизовані")
    } else {
      const userProfile = await User.findById(userId,
        'fullName lookingForAJobDescription aboutMe lookingForAJob photos location contacts created blockedAccaunt')
      if (!userProfile) {
        userErrorHandler(res, 404, "Такого користувача не існує")
      } else {
        res.json({
          data: {
            userId,
            fullName: userProfile.fullName,
            aboutMe: userProfile.aboutMe,
            lookingForAJob: userProfile.lookingForAJob,
            lookingForAJobDescription: userProfile.lookingForAJobDescription,
            created: userProfile.created,
            blockedAccaunt: userProfile.blockedAccaunt,
            photos: userProfile.photos,
            location: userProfile.location,
            contacts: userProfile.contacts
          }
        })

      }
    }
  } catch (err) {
    errorHandler(res, err)
  }
};
exports.userStatus = async (req, res, next) => {
  const userId = req.params.userId
  try {
    if (!userId) {
      userErrorHandler(res, 401, "Вибачте, ви не авторизовані")
    } else {
      const userStatus = await User.findById(req.params.userId, 'status')
      if (!userStatus) {
        res.status(404).json("Такого користувача не існує")
      } else {
        res.json({
          userStatus
        })
      }
    }
  } catch (err) {
    errorHandler(res, err)
  }
};
exports.updateStatus = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      userErrorHandler(res, 401, "Вибачте, ви не авторизовані")
    } else {
      if (!req.body.status) {
        userErrorHandler(res, 403, "Текст статусу відсутній")
      } else {
        User.findOneAndUpdate({ _id: req.session.userId }, { status: req.body.status }, (err, user) => {
        
          if (err) errorHandler(res, err)

          res.status(200).json({
            resultCode: 0,
            data: {}
          })

        })
      }
    }
  } catch (err) {
    errorHandler(res, err)
  }
};
exports.updateProfile = (req, res, next) => {
  try {
    if (!req.session.userId) {
      userErrorHandler(res, 401, "Вибачте, ви не авторизовані")
    } else {
      if (!req.body.data) {
        userErrorHandler(res, 403, "Дані відсутні")
      } else {
        User.findOneAndUpdate({ _id: req.session.userId }, {
          fullName: req.body.data.fullName,
          aboutMe: req.body.data.aboutMe,
          lookingForAJob: req.body.data.lookingForAJob,
          lookingForAJobDescription: req.body.data.lookingForAJobDescription,
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

        }, { new: true }, (err, user) => {

          if (err) errorHandler(res, err)

          res.status(200).json({
            resultCode: 0,
            data: {}
          })

        })
      }
    }
  } catch (err) {
    errorHandler(res, err)
  }
};



let userAvatarDirectory = null
exports.userAvatarDirectory = userAvatarDirectory


exports.updatePhoto = (req, res) => {
  try {
    if (!req.session.userId) {
      userErrorHandler(res, 401, "Вибачте, ви не авторизовані")
    } else {
      if (!req.file) {
        userErrorHandler(res, 403, "файл відсутній")
      } else {
        const pathAvatar = path.join(__dirname.slice(0, -10), 'files/images/avatar', req.session.userId)

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
        try {
            if (req.file) {
            
            User.findOneAndUpdate({ _id: req.session.userId }, {
                photos: {
                    large: photoUrl,
                    small: photoUrl,
                }
              
            
              }, (err, user) => {

                if (!err) {
                  res.status(200).json({
                    resultCode: 0,
                    data: {}
                  })
                }
              })
            }
        } catch (err) {
            errorHandler(res, err)
        }
      }
    }
  } catch (err) {
    errorHandler(res, err)
  }
}


