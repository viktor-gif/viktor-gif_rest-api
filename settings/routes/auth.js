'use strict'
const express = require('express')
const controller = require('../../controller/auth')

const router = express.Router()

router.post('/login', controller.login)
router.delete('/login', controller.logout)
router.get('/me', controller.me)


module.exports = router