const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const dialogSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    viewed: {
        type: Boolean,
        default: false
    },
    isSpam: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    sender: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    }
})

const dialogsSchema = new Schema({
    dialog: [dialogSchema],
    ownerId: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    userId: {
        ref: 'user',
        type: Schema.Types.ObjectId,
        required: true
    },
    ownerImgUrl: {
        type: String,
        default: null
    },
    userImgUrl: {
        type: String,
        default: null
    },
    ownerName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

exports.message = mongoose.model('messages', dialogSchema)
exports.dialog = mongoose.model('dialogs', dialogsSchema)