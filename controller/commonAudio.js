'use strict'
const path = require('path')
const Audio = require('../models/commonAudio').audio
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')

exports.getAudio = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const audioType = req.query.audioType
    try {
      console.log('req.query.term---____-----_____--')
      console.log(req.query.term)
      const term = (req.query.term === "null" || !req.query.term)
        ? null : req.query.term
      const regex = term && new RegExp(term, "i")

      if (audioType && audioType === "common_audio") {
        const commonAudio = term
          ? await Audio.find({ isPrivat: false, title: regex }).limit(5).skip(0)
          : await Audio.find({ isPrivat: false }).limit(5).skip(0)

        if (commonAudio) {
          res.status(200).json(commonAudio)
        } else {
          userErrorHandler(res, 404, "Трек не знайдено")
        }
      } else if (audioType && audioType === "all_my_audio") {
        const allMyAudio = term
          ? await Audio.find({ authorId: req.session.userId, title: regex }).limit(5).skip(0)
          : await Audio.find({ authorId: req.session.userId }).limit(5).skip(0)

        if (allMyAudio) {
          res.status(200).json(allMyAudio)
        } else {
          userErrorHandler(res, 404, "Трек не знайдено")
        }
      } else if (audioType && audioType === "my_privat_audio") {
        const myPrivatAudio = term
          ? await Audio.find({ authorId: req.session.userId, isPrivat: true, title: regex }).limit(5).skip(0)
          : await Audio.find({ authorId: req.session.userId, isPrivat: true }).limit(5).skip(0)

        if (myPrivatAudio) {
          res.status(200).json(myPrivatAudio)
        } else {
          userErrorHandler(res, 404, "Трек не знайдено")
        }
      } else if (audioType && audioType === "my_common_audio") {
        const myCommonAudio = term
          ? await Audio.find({ authorId: req.session.userId, isPrivat: false, title: regex }).limit(5).skip(0)
          : await Audio.find({ authorId: req.session.userId, isPrivat: false }).limit(5).skip(0)

        if (myCommonAudio) {
          res.status(200).json(myCommonAudio)
        } else {
          userErrorHandler(res, 404, "Трек не знайдено")
        }
      } else if (audioType && audioType === "added_audio") {
        const authUser = await User.findById(req.session.userId)
        const audioIds = authUser.audioIds
        console.log('ADDEDVIDEO-----____')
        console.log(audioIds)
        const commonAudio = await Audio.find({isPrivat: false})
        
        const addedAudio = []

        audioIds.forEach(a => {
          if (term) {
            const audioItem = commonAudio.find(item => item._id == a && item.title.toLowerCase().includes(term.toLowerCase()))
            
            audioItem && addedAudio.push(audioItem)
          } else {
            const audioItem = commonAudio.find(item => item._id == a)
            
            audioItem && addedAudio.push(audioItem)
          }
          
        })

        if (addedAudio) {
          res.status(200).json(addedAudio)
        } else {
          userErrorHandler(res, 404, "Трек не знайдено")
        }
      }
      
    } catch (err) {
      console.log(err)
      errorHandler(res, err)
    }
  }
}

exports.addAudio = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const fileUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path

      const isPrivat = req.query.isPrivat === 'true' ? true : false

      const newAudio = new Audio({
        authorId: req.session.userId,
        url: fileUrl,
        title: req.query.title || req.file.originalname,
        isPrivat
      })
      await newAudio.save()
      successHandler(res, 201, "Ви загрузили новий трек")
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.addCommonAudio = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const audioId = req.params.audioId
      const authUser = await User.findById(req.session.userId)
      const audioIdsArray = authUser.audioIds
      console.log(audioIdsArray)
      audioIdsArray.push(audioId)
      
      await authUser.save()
      successHandler(res, 200, "Ви додали нове відео")
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
