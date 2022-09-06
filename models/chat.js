const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const chatSchema = new Schema({
    authorId: {
        type: String,
        required: true
    },
    messageText: {
        type: String,
        required: true
    },
    likedUsers: [String],
    likesCount: {
        type: Number,
        default: 0
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('chat', chatSchema)