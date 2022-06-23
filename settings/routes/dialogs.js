'use strict'
const express = require('express')
const passport = require('passport')
const controller = require('../../controller/dialogs')

const router = express.Router()


router.get('/', controller.getDialogs)
router.post('/add', controller.addDialog)
router.get('/:dialogId/messages', controller.getDialogMessages)
router.post('/:dialogId/messages', controller.sendDialogMessage)
router.delete('/messages/:messageId', controller.deleteMessage)


module.exports = router


// passport.authenticate('jwt', {session: false}), 