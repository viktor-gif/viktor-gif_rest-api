'use strict'
const path = require('path')
const Dialog = require('../models/dialogs').dialog
const Message = require('../models/dialogs').message
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')
const User = require('../models/user').user
const fs = require('fs')

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
        const isOwner = (d.ownerId == ownerId)
          return {
            dialogId: d._id,
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
        if (ownerDialog || userDialog) {
          res.status(409).json({
            message: 'Такий діалог вже існує'
          })
        } else {
          const newDialog = new Dialog({
            Dialog: [],
            ownerId: req.session.userId,
            userId: req.query.userId
          })
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

      let imgUrl = null
      let videoUrl = null
      let audioUrl = null

      const fileUrl = req.file ? req.protocol + '://' + req.get('host') + '/' + req.file.path : null
      const extname = req.file ? path.extname(req.file.path) : null

      if (extname === '.png' || extname === '.jpeg' || extname === '.jpg' || extname === '.webp') {
        imgUrl = fileUrl
      } else if (extname === '.mp4' || extname === '.mov' || extname === '.mpeg4' || extname === '.flv' || extname === '.webm' || extname === '.asf' || extname === '.avi') {
        videoUrl = fileUrl
      } else if (extname === '.mpeg' || extname === '.ogg' || extname === '.mp3' || extname === '.aac') {
        audioUrl = fileUrl
      }

      const newMessage = new Message({
        message: req.query.messageText || null,
        image: imgUrl,
        video: videoUrl,
        audio: audioUrl,
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
          message: newMessage
        })
      }
      
    } catch (err) {
      errorHandler(res, err)
    }
  }
}

exports.updateMessage = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      
      const dialog = await Dialog.findById(req.params.dialogId)
      const currentDialog = dialog.dialog.find(item => item._id == req.params.messageId)

      let imgUrl = null
      let videoUrl = null
      let audioUrl = null

      const fileUrl = req.file ? req.protocol + '://' + req.get('host') + '/' + req.file.path : null
      const extname = req.file ? path.extname(req.file.path) : null

      if (extname === '.png' || extname === '.jpeg' || extname === '.jpg' || extname === '.webp') {
        imgUrl = fileUrl
      } else if (extname === '.mp4' || extname === '.mov' || extname === '.mpeg4' || extname === '.flv' || extname === '.webm' || extname === '.asf' || extname === '.avi') {
        videoUrl = fileUrl
      } else if (extname === '.mpeg' || extname === '.ogg' || extname === '.mp3' || extname === '.aac') {
        audioUrl = fileUrl
      }

      let fileType = null
      if (currentDialog.image) {
        fileType = 'images'
      } else if (currentDialog.video) {
        fileType = 'video'
      } else if (currentDialog.audio) {
        fileType = 'audio'
      }

      let filePath = null
      if (currentDialog.image) {
        filePath = currentDialog.image
      } else if (currentDialog.video) {
        filePath = currentDialog.video
      } else if (currentDialog.audio) {
        filePath = currentDialog.audio
      }
      const pathDialogsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/dialogs`)

      if (req.file) {
        fs.unlink(path.join(pathDialogsFile, path.basename(filePath)), (err) => {
          if (err) throw err;
          console.log('Картинка видалена');
        });
      }

      const updatedDialog = await Dialog.updateOne(
        { _id: req.params.dialogId, "dialog._id": req.params.messageId },
        {
          $set: {
            "dialog.$.message": req.query.messageText || null,
            "dialog.$.image": req.file ? imgUrl : currentDialog.image,
            "dialog.$.video": req.file ? videoUrl : currentDialog.video,
            "dialog.$.audio": req.file ? audioUrl : currentDialog.audio
          }
        })
      if (!updatedDialog) {
        userErrorHandler(res, 404, "Такого повідомлення не знайдено")
      } else {
        successHandler(res, 200, "Повідомлення було виправлено")
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
      const dialog = await Dialog.findById(req.params.dialogId)
      const message = dialog.dialog.find(item => item._id == req.params.messageId)
      
      let fileType = null
      if (message.image) {
        fileType = 'images'
      } else if (message.video) {
        fileType = 'video'
      } else if (message.audio) {
        fileType = 'audio'
      }

      let filePath = null
      if (message.image) {
        filePath = message.image
      } else if (message.video) {
        filePath = message.video
      } else if (message.audio) {
        filePath = message.audio
      }
      const pathDialogsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/dialogs`)

      if (filePath) {
        fs.unlink(path.join(pathDialogsFile, path.basename(filePath)), (err) => {
          if (err) throw err;
          console.log('Картинка видалена');
        });
      }

      dialog.dialog.pull({_id: req.params.messageId})
      await dialog.save()
      res.json('Deleted')
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
async function setOrRestoreSpam(req, res, isSpam, resMessage) {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const setSpam = await Dialog.updateOne(
        { _id: req.params.dialogId, "dialog._id": req.params.messageId },
        { $set: { "dialog.$.isSpam": isSpam } })
      if (!setSpam) {
        userErrorHandler(res, 404, "Повідомлення не знайдено")
      } else {
        successHandler(res, 200, resMessage)
      }
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.setSpam = (req, res, next) => {
  setOrRestoreSpam(req, res, true, "Повідомлення додано до спаму")
}
exports.restoreSpam = (req, res, next) => {
  setOrRestoreSpam(req, res, false, "Повідомлення видалено зі спаму")
}

exports.setViewedMessage = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      if (req.query.senderId != req.session.userId) {
        const setSpam = await Dialog.updateOne(
          { _id: req.params.dialogId, "dialog._id": req.params.messageId },
          { $set: { "dialog.$.viewed": true } })
        if (!setSpam) {
          userErrorHandler(res, 404, "Повідомлення не знайдено")
        } else {
          successHandler(res, 200, "Повідомлення переглянуто")
        }
      } else {
        res.json('WOOPS!')
      }
    } catch (err) {
      errorHandler(res, err)
    }
  }
}