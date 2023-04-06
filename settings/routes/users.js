'use strict'
const express = require('express')
const passport = require('passport')
const controller = require('../../controller/users')

const router = express.Router()


router.get('/', controller.users)
router.post('/add', controller.add)

router.get('/test', controller.test__1)


module.exports = router


// passport.authenticate('jwt', {session: false}), 