'use strict'
const express = require('express')
const controller = require('../../controller/profile')
const fileMiddleware = require('../../middleware/file_avatarImg')

const router = express.Router()

router.get('/:userId', controller.userProfile)
router.get('/status/:userId', controller.userStatus)
router.put('/', controller.updateProfile)
router.put('/status', controller.updateStatus)
router.put('/photo', fileMiddleware.single('avatar'), controller.updatePhoto)

module.exports = router