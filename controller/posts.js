'use strict'
const path = require('path')
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')
const Post = require('../models/posts').post
const Comment = require('../models/posts').comment
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
exports.addImages = (req, res) => {
    // const pathAvatar = path.join(__dirname.slice(0, -10), 'files/images/posts')

        const photoUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path
        console.log('photourl: ' + photoUrl);
        try {
            if (req.file) {
            
              res.json(req.file)
              
            }
        } catch (err) {
            console.log(err);
        }
}
exports.addVideo = (req, res) => {
    // const pathAvatar = path.join(__dirname.slice(0, -10), 'files/images/posts')

        const photoUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path
        console.log('photourl: ' + photoUrl);
        try {
            if (req.file) {
            
              res.json(req.file)
              
            }
        } catch (err) {
            console.log(err);
        }
}
exports.addAudio = (req, res) => {
    // const pathAvatar = path.join(__dirname.slice(0, -10), 'files/images/posts')

        const photoUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path
        console.log('photourl: ' + photoUrl);
        try {
            if (req.file) {
            
              res.json(req.file)
              
            }
        } catch (err) {
            console.log(err);
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
exports.updatePost = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      Post.findByIdAndUpdate(req.params.postId,
        {postText: req.body.postText},
        (err, result) => {
        if (err) {
          console.log(err)
        } else {
          if (result) {
            successHandler(res, 200, "Ви змінили текст поста")
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
exports.toggleLike = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const post = await Post.findById(req.params.postId)
      console.log(post.likedUsers, post.likesCount)
      if (post.likedUsers.includes(req.session.userId)) {
        await Post.findByIdAndUpdate(req.params.postId,
          { likesCount: post.likesCount - 1 })
        post.likedUsers.pull(req.session.userId)
        await post.save()
        successHandler(res, 200, "Ви видалили лайк")
      } else {
        await Post.findByIdAndUpdate(req.params.postId,
          { likesCount: post.likesCount + 1 })
        post.likedUsers.push(req.session.userId)
        await post.save()
        successHandler(res, 200, "Ви поставили лайк")
      }
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.addComment = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const newComment = new Comment({
        commentText: req.body.commentText,
        authorId: req.session.userId,
      })
      // const newMessage = { message: 'hello world' }
      const post = await Post.findById(req.params.postId)
      if (!post) {
        res.status(404).json({
          message: "Такого поста не існує"
        })
      } else {
        post.comments.push(newComment)
        await post.save()
        successHandler(res, 201, "Коментар додано")
      }
      
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.updateComment = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const updatedPost = await Post.updateOne(
        { _id: req.params.postId, "comments._id": req.params.commentId },
        { $set: { "comments.$.commentText": req.body.commentText } })
      if (!updatedPost) {
        userErrorHandler(res, 404, "Такий коментар не знайдено")
      } else {
        successHandler(res, 200, "Коментар було виправлено")
      }
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.deleteComment = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      // const newMessage = { message: 'hello world' }
      const post = await Post.findById(req.params.postId)
      if (!post) {
        res.status(404).json({
          message: "Такого коментаря не існує"
        })
      } else {
        post.comments.pull({_id: req.params.commentId})
        await post.save()
        successHandler(res, 200, "Коментар видалено")
      }
      
    } catch (err) {
      errorHandler(res, err)
    }
  }
}
exports.toggleCommentLike = async (req, res, next) => {
  if (!req.session.userId) {
    res.status(403).json({
      message: "Ви не зареєстровані. Ввійдіть, будь ласка, в аккаунт."
    })
  } else {
    try {
      const post = await Post.findOne({ _id: req.params.postId })
      const comment = post.comments.find(c => c._id == req.params.commentId)

      if (comment.likedUsers.includes(req.session.userId)) {
        comment.likedUsers.pull(req.session.userId)
        await post.save()
        successHandler(res, 200, "Ви видалили лайк")
      } else {
        comment.likedUsers.push(req.session.userId)
        await post.save()
        successHandler(res, 200, "Ви поставили лайк")
      }
    } catch (err) {
      errorHandler(res, err)
    }
  }
}