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
        default: 'public'
    },
    topic: {
        type: String,
        default: 'no topic'
    },
    mainImg: {
        type: String,
        default: null
    },
    describeInfo: {
        type: String,
        default: null
    },

    followers: [String],
    posts: [groopsPostsSchema],
    created: {
        type: Date,
        default: Date.now
    }
})

exports.groop = mongoose.model('groops', groopsSchema)