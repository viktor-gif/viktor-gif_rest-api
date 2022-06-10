'use strict'
const express = require('express')
const controller = require('../../controller/follow')

const router = express.Router()

router.post('/', controller.setFollow)
router.delete('/', controller.deleteFollow)
router.get('/', controller.getFollow)

module.exports = router