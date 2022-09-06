'use strict'
const path = require('path')
const Video = require('../models/commonVideo').video
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')

exports.getVideo = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const video = await Video.find()

      if (video) {
        res.status(200).json(video)
      } else {
        userErrorHandler(res, 404, "Відео не знайдено")
      }
      
    } catch (err) {
      errorHandler(res, err)
    }
  }
}

exports.addVideo = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      console.log(req.file)
      const fileUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path

      const isPrivat = req.query.isPrivat === 'true' ? true : false

      const newVideo = new Video({
        authorId: req.session.userId,
        url: fileUrl,
        title: req.query.title || req.file.originalname,
        isPrivat
      })
      await newVideo.save()
      successHandler(res, 201, "Ви створили новий пост")
    } catch (err) {
      console.log(err)
      errorHandler(res, err)
    }
  }
}
