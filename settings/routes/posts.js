'use strict'
const express = require('express')
const controller = require('../../controller/posts')
const filesMiddleware = require('../../middleware/file_mediaFiles')
const router = express.Router()

router.get('/', controller.getPosts)

router.post('/', filesMiddleware.single('posts'), controller.addPost)

router.delete('/:postId', controller.deletePost)
router.put('/:postId', controller.updatePost)
router.put('/:postId/like', controller.toggleLike)
router.post('/:postId/comments', filesMiddleware.single('comments'), controller.addComment)
router.put('/:postId/comments/:commentId/update', controller.updateComment)
router.delete('/:postId/comments/:commentId', controller.deleteComment)
router.put('/:postId/comments/:commentId/like', controller.toggleCommentLike)

module.exports = router


// passport.authenticate('jwt', {session: false}), 