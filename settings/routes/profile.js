'use strict'
const express = require('express')
const controller = require('../../controller/profile')

const router = express.Router()

router.get('/:userId', controller.userProfile)
router.get('/status/:userId', controller.userStatus)
router.put('/', controller.updateProfile)
router.put('/status', controller.updateStatus)


module.exports = router