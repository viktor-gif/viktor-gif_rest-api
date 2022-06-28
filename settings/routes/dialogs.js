'use strict'
const express = require('express')
const passport = require('passport')
const controller = require('../../controller/dialogs')

const router = express.Router()


router.get('/', controller.getDialogs)
router.post('/add', controller.addDialog)
router.get('/:dialogId/messages', controller.getDialogMessages)
router.post('/:dialogId/messages', controller.sendDialogMessage)
router.delete('/:dialogId/messages/:messageId', controller.deleteMessage)
router.delete('/:dialogId/messages/:messageId', controller.deleteMessage)
router.put('/:dialogId/messages/:messageId/set_spam', controller.setSpam)
router.put('/:dialogId/messages/:messageId/restore_spam', controller.restoreSpam)


module.exports = router


// passport.authenticate('jwt', {session: false}), 