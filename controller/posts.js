'use strict'
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')
const Post = require('../models/posts')
const { json } = require('body-parser')

/* GET users listing. */
exports.getPosts = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const posts = await Post.find({ profileId: req.query.userId })
      console.log(posts)
      res.status(200).json(posts)
    } catch (err) {
      console.log(err)
      errorHandler(res, err)
    }
  }
  
}
exports.addPost = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const newPost = new Post({
        authorId: req.session.userId,
        profileId: req.query.userId,
        postText: req.body.postText
      })
      await newPost.save()
      successHandler(res, 201, "Ви створили новий пост")
    } catch (err) {
      errorHandler(res, err)
    }
  }
  
}
exports.deletePost = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      Post.findByIdAndDelete(req.params.postId, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          if (result) {
            console.log(result)
            successHandler(res, 200, "Ви видалили пост")
          } else {
            userErrorHandler(res, 404, "Такого поста не існує")
          }
        }
      })
    } catch (err) {
      errorHandler(res, err)
    }
  }
}