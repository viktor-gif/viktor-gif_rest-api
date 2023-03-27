'use strict'
const express = require('express')
const controller = require('../../controller/groops')

const router = express.Router()

router.post('/', controller.createGroop)
router.delete('/', controller.deleteGroop)
router.get('/', controller.getGroops)
router.get('/:groopId', controller.getGroopInfo)
router.post('/:groopId/addFollower', controller.addFollower)
router.delete('/:groopId/deleteFollower', controller.deleteFollower)

router.post('/:groopId/post/add', controller.addPost)
router.post('/:groopId/post/:postId/delete', controller.deletePost)


module.exports = router