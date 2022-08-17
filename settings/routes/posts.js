'use strict'
const express = require('express')
const controller = require('../../controller/posts')
const imgMiddleware = require('../../middleware/file_postsImg')
const videoMiddleware = require('../../middleware/file_postsVideo')
const audioMiddleware = require('../../middleware/file_postsAudio')
const router = express.Router()

router.get('/', controller.getPosts)

router.post('/', controller.addPost)
router.post('/images', imgMiddleware.single('posts'), controller.addImages)
router.post('/video', videoMiddleware.single('posts'), controller.addVideo)
router.post('/audio', audioMiddleware.single('posts'), controller.addAudio)

router.delete('/:postId', controller.deletePost)
router.put('/:postId', controller.updatePost)
router.put('/:postId/like', controller.toggleLike)
router.post('/:postId/comments', controller.addComment)
router.put('/:postId/comments/:commentId/update', controller.updateComment)
router.delete('/:postId/comments/:commentId', controller.deleteComment)
router.put('/:postId/comments/:commentId/like', controller.toggleCommentLike)

module.exports = router


// passport.authenticate('jwt', {session: false}), 