'use strict'
const express = require('express')
const controller = require('../../controller/users')

const router = express.Router()


router.get('/', controller.users)
router.post('/add', controller.add)


module.exports = router