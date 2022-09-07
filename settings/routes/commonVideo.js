'use strict'
const express = require('express')
const controller = require('../../controller/commonVideo')
const filesMiddleware = require('../../middleware/commonVideo.js')

const router = express.Router()

router.get('/', controller.getVideo)
router.post('/', filesMiddleware.single('video'), controller.addVideo)
router.put('/:videoId/add', controller.addCommonVideo)

module.exports = router