'use strict'
const path = require('path')
const Img = require('../models/commonImg').img
const User = require('../models/user').user
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')

exports.getImg = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const imgType = req.query.imgType
    try {
      console.log('req.query.term---____-----_____--')
      console.log(`REQ___QUERY__TERM${req.query.term}`)
      const term = (req.query.term === "null" || !req.query.term)
        ? null : req.query.term
      const regex = term && new RegExp(term, "i")

      if (imgType && imgType === "common_img") {
        const commonImg = term
          ? await Img.find({ isPrivat: false, title: regex }).limit(5).skip(0)
          : await Img.find({ isPrivat: false }).limit(5).skip(0)

        if (commonImg) {
          res.status(200).json(commonImg)
          console.log(`COMMON_____IMG${commonImg}`)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (imgType && imgType === "all_my_img") {
        const allMyImg = term
          ? await Img.find({ authorId: req.session.userId, title: regex }).limit(5).skip(0)
          : await Img.find({ authorId: req.session.userId }).limit(5).skip(0)

        if (allMyImg) {
          res.status(200).json(allMyImg)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (imgType && imgType === "my_privat_img") {
        const myPrivatImg = term
          ? await Img.find({ authorId: req.session.userId, isPrivat: true, title: regex }).limit(5).skip(0)
          : await Img.find({ authorId: req.session.userId, isPrivat: true }).limit(5).skip(0)

        if (myPrivatImg) {
          res.status(200).json(myPrivatImg)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (imgType && imgType === "my_common_img") {
        const myCommonImg = term
          ? await Img.find({ authorId: req.session.userId, isPrivat: false, title: regex }).limit(5).skip(0)
          : await Img.find({ authorId: req.session.userId, isPrivat: false }).limit(5).skip(0)

        if (myCommonImg) {
          res.status(200).json(myCommonImg)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (imgType && imgType === "added_img") {
        const authUser = await User.findById(req.session.userId)
        const imgIds = authUser.imgIds
        console.log('ADDEDImg-----____')
        console.log(imgIds)
        const commonImg = await Img.find({isPrivat: false})
        
        const addedImg = []

        imgIds.forEach(v => {
          if (term) {
            const imgItem = commonImg.find(item => item._id == v && item.title.toLowerCase().includes(term.toLowerCase()))
            
            imgItem && addedImg.push(imgItem)
          } else {
            const imgItem = commonImg.find(item => item._id == v)
            
            imgItem && addedImg.push(imgItem)
          }
          
        })

        if (addedImg) {
          res.status(200).json(addedImg)
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

exports.getImgGroop = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const imgType = req.query.imgType
    const groopId = req.query.groopId
    try {
      console.log(req.query.term)
      const term = (req.query.term === "null" || !req.query.term)
        ? null : req.query.term
      const regex = term && new RegExp(term, "i")

      if (imgType && imgType === "common_img") {
        const commonImg = term
          ? await Img.find({ isPrivat: false, groopId, title: regex }).limit(5).skip(0)
          : await Img.find({ isPrivat: false, groopId }).limit(5).skip(0)

        if (commonImg) {
          res.status(200).json(commonImg)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (imgType && imgType === "privat_img") {
        const myPrivatImg = term
          ? await Img.find({ isPrivat: true, groopId, title: regex }).limit(5).skip(0)
          : await Img.find({ isPrivat: true, groopId }).limit(5).skip(0)

        if (myPrivatImg) {
          res.status(200).json(myPrivatImg)
        } else {
          userErrorHandler(res, 404, "Відео не знайдено")
        }
      } else if (imgType && imgType === "all_img") {
        const myCommonImg = term
          ? await Img.find({ groopId, title: regex }).limit(5).skip(0)
          : await Img.find({ groopId }).limit(5).skip(0)

        if (myCommonImg) {
          res.status(200).json(myCommonImg)
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

exports.addImg = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const fileUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path

      const isPrivat = req.query.isPrivat === 'true' ? true : false

      const newImg = new Img({
        authorId: req.session.userId,
        groopId: req.query.groopId || null,
        url: fileUrl,
        title: req.query.title || req.file.originalname,
        isPrivat
      })
      await newImg.save()
      successHandler(res, 201, "Ви загрузили нове відео")
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.addCommonImg = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const imgId = req.params.imgId
      const authUser = await User.findById(req.session.userId)
      const imgIdsArray = authUser.imgIds
      console.log(imgIdsArray)
      imgIdsArray.push(imgId)
      
      await authUser.save()
      successHandler(res, 200, "Ви додали нове відео")
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
