'use strict'
const express = require('express')
const passport = require('passport')
const controller = require('../../controller/posts')

const router = express.Router()


router.get('/', controller.getPosts)
router.post('/', controller.addPost)
router.delete('/:postId', controller.deletePost)

module.exports = router


// passport.authenticate('jwt', {session: false}), 