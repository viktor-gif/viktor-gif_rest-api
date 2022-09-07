'use strict'
const path = require('path')
const Video = require('../models/commonVideo').video
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')

exports.getVideo = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const videoType = req.query.videoType
    try {
      console.log('req.query.term---____-----_____--')
      console.log(req.query.term)
      const term = (req.query.term === "null" || !req.query.term)
        ? null : req.query.term
      const regex = term && new RegExp(term, "i")

      if (videoType && videoType === "common_video") {
        const commonVideo = term
          ? await Video.find({ isPrivat: false, title: regex }).limit(5).skip(0)
          : await Video.find({ isPrivat: false }).limit(5).skip(0)

        if (commonVideo) {
          res.status(200).json(commonVideo)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (videoType && videoType === "all_my_video") {
        const allMyVideo = term
          ? await Video.find({ authorId: req.session.userId, title: regex }).limit(5).skip(0)
          : await Video.find({ authorId: req.session.userId }).limit(5).skip(0)

        if (allMyVideo) {
          res.status(200).json(allMyVideo)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (videoType && videoType === "my_privat_video") {
        const myPrivatVideo = term
          ? await Video.find({ authorId: req.session.userId, isPrivat: true, title: regex }).limit(5).skip(0)
          : await Video.find({ authorId: req.session.userId, isPrivat: true }).limit(5).skip(0)

        if (myPrivatVideo) {
          res.status(200).json(myPrivatVideo)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (videoType && videoType === "my_common_video") {
        const myCommonVideo = term
          ? await Video.find({ authorId: req.session.userId, isPrivat: false, title: regex }).limit(5).skip(0)
          : await Video.find({ authorId: req.session.userId, isPrivat: false }).limit(5).skip(0)

        if (myCommonVideo) {
          res.status(200).json(myCommonVideo)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (videoType && videoType === "added_video") {
        const authUser = await User.findById(req.session.userId)
        const videoIds = authUser.videoIds
        console.log('ADDEDVIDEO-----____')
        console.log(videoIds)
        const commonVideo = await Video.find({isPrivat: false})
        
        const addedVideo = []

        videoIds.forEach(v => {
          if (term) {
            const videoItem = commonVideo.find(item => item._id == v && item.title.toLowerCase().includes(term.toLowerCase()))
            
            videoItem && addedVideo.push(videoItem)
          } else {
            const videoItem = commonVideo.find(item => item._id == v)
            
            videoItem && addedVideo.push(videoItem)
          }
          
        })

        if (addedVideo) {
          res.status(200).json(addedVideo)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      }
      
    } catch (err) {
      console.log(err)
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
      const fileUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path

      const isPrivat = req.query.isPrivat === 'true' ? true : false

      const newVideo = new Video({
        authorId: req.session.userId,
        url: fileUrl,
        title: req.query.title || req.file.originalname,
        isPrivat
      })
      await newVideo.save()
      successHandler(res, 201, "Ви загрузили нове відео")
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.addCommonVideo = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const videoId = req.params.videoId
      const authUser = await User.findById(req.session.userId)
      const videoIdsArray = authUser.videoIds
      console.log(videoIdsArray)
      videoIdsArray.push(videoId)
      
      await authUser.save()
      successHandler(res, 200, "Ви додали нове відео")
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
