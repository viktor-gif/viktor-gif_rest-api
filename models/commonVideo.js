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

const videoSchema = new Schema({
    authorId: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: null
    },
    isPrivat: {
        type: Boolean,
        default: false
    },
    comments: [commentsSchema],
    likedUsers: [String],
    created: {
        type: Date,
        default: Date.now
    }
})

exports.video = mongoose.model('video', videoSchema)
exports.videoComments = mongoose.model('videoComments', commentsSchema)