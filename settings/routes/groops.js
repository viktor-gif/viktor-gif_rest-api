'use strict'
const express = require('express')
const controller = require('../../controller/groops')

const router = express.Router()

router.post('/', controller.createGroop)
router.delete('/', controller.deleteGroop)
router.get('/', controller.getGroops)

module.exports = router