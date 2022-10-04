const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const commentsSchema = new Schema({
    authorId: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    linkToAnotherComment: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    },
    commentText: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    video: {
        type: String,
        default: null
    },
    audio: {
        type: String,
        default: null
    },
    likedUsers: [String],
    likesCount: {
        type: Number,
        default: 0
    },
})

const groopsPostsSchema = new Schema({
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
        default: null
    },
    postImg: {
        type: String,
        default: null
    },
    postVideo: {
        type: String,
        default: null
    },
    postAudio: {
        type: String,
        default: null
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

const groopsSchema = new Schema({
    authorId: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: ' public'
    },

    followers: [String],
    posts: [groopsPostsSchema],
    postVideo: {
        type: String,
        default: null
    },
    postAudio: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    }
})

exports.groops = mongoose.model('groops', groopsSchema)
exports.posts = mongoose.model('groopsPosts', groopsPostsSchema)
exports.comments = mongoose.model('groopsPostsComments', commentsSchema)