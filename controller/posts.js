'use strict'
const fs = require('fs')
const path = require('path')
const errorHandler = require('../utils/errorHandler')
const successHandler = require('../utils/successHandler')
const userErrorHandler = require('../utils/userErrorHandler')
const Post = require('../models/posts').post
const Comment = require('../models/posts').comment

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
    const postText = req.query.postText
    try {
      const fileUrl = req.file ? req.protocol + '://' + req.get('host') + '/' + req.file.path : null
      const extname = req.file ? path.extname(req.file.path) : null

      let imgUrl = null
      let videoUrl = null
      let audioUrl = null

      if (extname === '.png' || extname === '.jpeg' || extname === '.jpg' || extname === '.webp') {
        imgUrl = fileUrl
      } else if (extname === '.mp4' || extname === '.mov' || extname === '.mpeg4' || extname === '.flv' || extname === '.webm' || extname === '.asf' || extname === '.avi') {
        videoUrl = fileUrl
      } else if (extname === '.mpeg' || extname === '.ogg' || extname === '.mp3' || extname === '.aac') {
        audioUrl = fileUrl
      }

      const newPost = new Post({
        authorId: req.session.userId,
        profileId: req.query.userId,
        postText: postText || null,
        postImg: imgUrl,
        postVideo: videoUrl,
        postAudio: audioUrl
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
      const post = await Post.findById(req.params.postId)
      const comments = post.comments

      comments.forEach(c => {

        let fileType = null
        if (c.image) {
          fileType = 'images'
        } else if (c.video) {
          fileType = 'video'
        } else if (c.audio) {
          fileType = 'audio'
        }

        let filePath = null
        if (c.image) {
          filePath = c.image
        } else if (c.video) {
          filePath = c.video
        } else if (c.audio) {
          filePath = c.audio
        }
        const pathCommentsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/comments`)

        if (filePath) {
          fs.unlink(path.join(pathCommentsFile, path.basename(filePath)), (err) => {
            if (err) throw err;
            console.log('Картинка видалена');
          });
        }
      })

      let fileType = null
      if (post.postImg) {
        fileType = 'images'
      } else if (post.postVideo) {
        fileType = 'video'
      } else if (post.postAudio) {
        fileType = 'audio'
      }

      let filePath = null
      if (post.postImg) {
        filePath = post.postImg
      } else if (post.postVideo) {
        filePath = post.postVideo
      } else if (post.postAudio) {
        filePath = post.postAudio
      }
      const pathPostsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/posts`)

      if (filePath) {
        fs.unlink(path.join(pathPostsFile, path.basename(filePath)), (err) => {
          if (err) throw err;
          console.log('Картинка видалена');
        });
      }

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

      const post = await Post.findById(req.params.postId)
      let imgUrl = null
      let videoUrl = null
      let audioUrl = null

      const fileUrl = req.file ? req.protocol + '://' + req.get('host') + '/' + req.file.path : null
      const extname = req.file ? path.extname(req.file.path) : null

      if (extname === '.png' || extname === '.jpeg' || extname === '.jpg' || extname === '.webp') {
        imgUrl = fileUrl
      } else if (extname === '.mp4' || extname === '.mov' || extname === '.mpeg4' || extname === '.flv' || extname === '.webm' || extname === '.asf' || extname === '.avi') {
        videoUrl = fileUrl
      } else if (extname === '.mpeg' || extname === '.ogg' || extname === '.mp3' || extname === '.aac') {
        audioUrl = fileUrl
      }

      let fileType = null
      if (post.postImg) {
        fileType = 'images'
      } else if (post.postVideo) {
        fileType = 'video'
      } else if (post.postAudio) {
        fileType = 'audio'
      }

      let filePath = null
      if (post.postImg) {
        filePath = post.postImg
      } else if (post.postVideo) {
        filePath = post.postVideo
      } else if (post.postAudio) {
        filePath = post.postAudio
      }
      const pathPostsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/posts`)

      if (req.file && filePath) {
        fs.unlink(path.join(pathPostsFile, path.basename(filePath)), (err) => {
          if (err) throw err;
          console.log('Картинка видалена');
        });
      }

      Post.findByIdAndUpdate(req.params.postId,
        {
          postText: req.query.postText || null,
          postImg: req.file ? imgUrl : post.postImg,
          postVideo: req.file ? videoUrl : post.postVideo,
          postAudio: req.file ? audioUrl : post.postAudio
        },
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
    const commentText = req.query.commentText || null
    const linkToAnotherComment = req.query.linkToAnotherComment === "null" ? null : req.query.linkToAnotherComment
    try {
      const fileUrl = req.file ? req.protocol + '://' + req.get('host') + '/' + req.file.path : null
      const extname = req.file ? path.extname(req.file.path) : null

      let imgUrl = null
      let videoUrl = null
      let audioUrl = null

      if (extname === '.png' || extname === '.jpeg' || extname === '.jpg' || extname === '.webp') {
        imgUrl = fileUrl
      } else if (extname === '.mp4' || extname === '.mov' || extname === '.mpeg4' || extname === '.flv' || extname === '.webm' || extname === '.asf' || extname === '.avi') {
        videoUrl = fileUrl
      } else if (extname === '.mpeg' || extname === '.ogg' || extname === '.mp3' || extname === '.aac') {
        audioUrl = fileUrl
      }
      const newComment = new Comment({
        authorId: req.session.userId,
        image: imgUrl,
        video: videoUrl,
        audio: audioUrl,
        commentText,
        linkToAnotherComment
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
      const post = await Post.findById(req.params.postId)
      const currentComment = post.comments.find(item => item._id == req.params.commentId)

      let imgUrl = null
      let videoUrl = null
      let audioUrl = null

      const fileUrl = req.file ? req.protocol + '://' + req.get('host') + '/' + req.file.path : null
      const extname = req.file ? path.extname(req.file.path) : null

      if (extname === '.png' || extname === '.jpeg' || extname === '.jpg' || extname === '.webp') {
        imgUrl = fileUrl
      } else if (extname === '.mp4' || extname === '.mov' || extname === '.mpeg4' || extname === '.flv' || extname === '.webm' || extname === '.asf' || extname === '.avi') {
        videoUrl = fileUrl
      } else if (extname === '.mpeg' || extname === '.ogg' || extname === '.mp3' || extname === '.aac') {
        audioUrl = fileUrl
      }

      let fileType = null
      if (currentComment.image) {
        fileType = 'images'
      } else if (currentComment.video) {
        fileType = 'video'
      } else if (currentComment.audio) {
        fileType = 'audio'
      }

      let filePath = null
      if (currentComment.image) {
        filePath = currentComment.image
      } else if (currentComment.video) {
        filePath = currentComment.video
      } else if (currentComment.audio) {
        filePath = currentComment.audio
      }

      const pathCommentsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/comments`)

      Post.updateOne(
        { _id: req.params.postId, "comments._id": req.params.commentId },
        {
          $set: {
            "comments.$.commentText": req.query.commentText || null,
            "comments.$.image": req.file ? imgUrl : currentComment.image,
            "comments.$.video": req.file ? videoUrl : currentComment.video,
            "comments.$.audio": req.file ? audioUrl : currentComment.audio
          }
        }, (err, result) => {
          if (err) {
          }
          if (result) {
            successHandler(res, 200, "Повідомлення було виправлено")
          } else {
            userErrorHandler(res, 404, "Такого повідомлення не знайдено")
            
          }
      })

      
      
      if (req.file && filePath) {
        fs.unlink(path.join(pathCommentsFile, path.basename(filePath)), (err) => {
          if (err) throw err;
          console.log('Картинка видалена');
        });
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
      const post = await Post.findById(req.params.postId)
      const comments = post.comments
      const currentComment = comments.find(item => item._id == req.params.commentId)
      const answerComments = comments.filter(c => currentComment._id == c.linkToAnotherComment)

      answerComments.forEach(ac => {
        let fileType = null
        if (ac.image) {
          fileType = 'images'
        } else if (ac.video) {
          fileType = 'video'
        } else if (ac.audio) {
          fileType = 'audio'
        }

        let filePath = null
        if (ac.image) {
          filePath = ac.image
        } else if (ac.video) {
          filePath = ac.video
        } else if (ac.audio) {
          filePath = ac.audio
        }

        const pathCommentsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/comments`)
        if (filePath) {
          fs.unlink(path.join(pathCommentsFile, path.basename(filePath)), (err) => {
            if (err) throw err;
            console.log('Картинка видалена');
          });
        }

        post.comments.pull({_id: ac._id})
      })

      let fileType = null
      if (currentComment.image) {
        fileType = 'images'
      } else if (currentComment.video) {
        fileType = 'video'
      } else if (currentComment.audio) {
        fileType = 'audio'
      }

      let filePath = null
      if (currentComment.image) {
        filePath = currentComment.image
      } else if (currentComment.video) {
        filePath = currentComment.video
      } else if (currentComment.audio) {
        filePath = currentComment.audio
      }

      const pathCommentsFile = path.join(__dirname.slice(0, -10), `files/${fileType}/comments`)
      if (filePath) {
        fs.unlink(path.join(pathCommentsFile, path.basename(filePath)), (err) => {
          if (err) throw err;
          console.log('Картинка видалена');
        });
      }

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