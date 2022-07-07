const { required } = require('nconf')

const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const commentsSchema = new Schema({
    authorId: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    commentText: {
        type: String,
        required: true
    },
    likedUsers: [String],
    likesCount: {
        type: Number,
        default: 0
    },
})

const postsSchema = new Schema({
    authorId: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    profileId: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    postText: {
        type: String,
        required: true
    },
    likedUsers: [String],
    likesCount: {
        type: Number,
        default: 0
    },
    comments: [commentsSchema],
    created: {
        type: Date,
        default: Date.now
    }
})

exports.post = mongoose.model('posts', postsSchema)
exports.comment = mongoose.model('postComments', commentsSchema)