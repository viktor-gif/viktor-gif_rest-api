'use strict'
const express = require('express')
const controller = require('../../controller/commonAudio')
const filesMiddleware = require('../../middleware/commonAudio.js')

const router = express.Router()

router.get('/', controller.getAudio)
router.post('/', filesMiddleware.single('audio'), controller.addAudio)
router.put('/:audioId/add', controller.addCommonAudio)

module.exports = router