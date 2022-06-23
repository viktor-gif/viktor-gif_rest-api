'use strict'
const Dialog = require('../models/dialogs').dialog
const Message = require('../models/dialogs').message
const errorHandler = require('../utils/errorHandler')
const User = require('../models/user').user

/* GET users listing. */
exports.getDialogs = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    const ownerId = req.session.userId
    try {
      const ownerDialog = await Dialog.find({
        ownerId: ownerId
      })
      const userDialog = await Dialog.find({
        userId: ownerId
      })
      const allDialogs = ownerDialog.concat(userDialog)
      res.status(200).json({
        items: allDialogs.map(d => {
        const isOwner = d.ownerId == ownerId
          return {
            userId: isOwner ? d.userId : d.ownerId,
            userImgUrl: isOwner ? d.userImgUrl : d.ownerImgUrl,
            userName: isOwner ? d.userName : d.ownerName,
            created: d.created
          }
        })
      })
    } catch (err) {
      console.log(err)
      errorHandler(res, err)
    }
  }
  
};
exports.addDialog = async (req, res, next) => {
    if (!req.session.userId) {
      res.status(403).json({
        message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
      })
    } else {
      try {
        const ownerDialog = await Dialog.findOne({
          ownerId: req.session.userId,
          userId: req.query.userId
        })
        const userDialog = await Dialog.findOne({
          ownerId: req.query.userId,
          userId: req.session.userId
        })
        const owner = await User.findById(req.session.userId)
        const user = await User.findById(req.query.userId)
        if (ownerDialog || userDialog) {
          res.status(409).json({
            message: 'Такий діалог вже існує'
          })
        } else {
          const newDialog = new Dialog({
            Dialog: [],
            ownerId: req.session.userId,
            userId: req.query.userId,
            ownerImgUrl: owner.photos.small,
            userImgUrl: user.photos.small,
            ownerName: owner.fullName,
            userName: user.fullName
          })
          console.log(newDialog)
          await newDialog.save()
          res.status(201).json({
            message: "Діалог успішно створений"
          })
        }
      } catch (err) {
        errorHandler(res, err)
      }
    }
  
}
exports.sendDialogMessage = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const newMessage = new Message({
        message: req.body.message,
        sender: req.session.userId
      })
      // const newMessage = { message: 'hello world' }
      const dialog = await Dialog.findById(req.params.dialogId)
      if (!dialog) {
        res.status(404).json({
          message: "Такого діалога не існує"
        })
      } else {
        dialog.dialog.push(newMessage)
        await dialog.save()
        res.status(201).json({
          message: 'Повідомлення відправлено'
        })
      }
      
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.getDialogMessages = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const dialog = await Dialog.findById(req.params.dialogId)
      if (!dialog) {
        res.status(404).json({
          message: "Такого діалога не існує"
        })
      } else {
        res.status(200).json(dialog.dialog)
      }
      
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.deleteMessage = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const dialog = await Dialog.findById(req.params.messageId)
      dialog.dialog.pull({_id: req.query.messageId})
      await dialog.save()
      res.json('Deleted')
    } catch (err) {
      errorHandler(res, err)
    }
  }
}


