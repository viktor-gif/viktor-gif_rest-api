const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const commentsImgSchema = new Schema({
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

const imgSchema = new Schema({
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
    comments: [commentsImgSchema],
    likedUsers: [String],
    created: {
        type: Date,
        default: Date.now
    }
})

const commentsVideoSchema = new Schema({
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
    comments: [commentsVideoSchema],
    likedUsers: [String],
    created: {
        type: Date,
        default: Date.now
    }
})

const commentsAudioSchema = new Schema({
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

const audioSchema = new Schema({
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
    comments: [commentsAudioSchema],
    likedUsers: [String],
    created: {
        type: Date,
        default: Date.now
    }
})

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
    img: [imgSchema],
    video: [videoSchema],
    audio: [audioSchema],
    created: {
        type: Date,
        default: Date.now
    }
})

exports.groop = mongoose.model('groops', groopsSchema)
exports.posts = mongoose.model('groopsPosts', groopsPostsSchema)
exports.comments = mongoose.model('groopsPostsComments', commentsSchema)