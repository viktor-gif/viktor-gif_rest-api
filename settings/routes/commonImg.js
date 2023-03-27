'use strict'
const express = require('express')
const controller = require('../../controller/commonImg')
const filesMiddleware = require('../../middleware/commonImg.js')

const router = express.Router()

router.get('/', controller.getImg)
router.get('/groops/:groopId', controller.getImgGroop)
router.post('/', filesMiddleware.single('img'), controller.addImg)
router.put('/:imgId/add', controller.addCommonImg)

module.exports = router