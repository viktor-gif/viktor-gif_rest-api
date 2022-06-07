const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const schema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: null
    },
    aboutMe: {
        type: String,
        default: null
    },
    lookingForAJob: {
        type: Boolean,
        default: false
    },
    lookingForAJobDescription: {
        type: String,
        default: null
    },
    photos: {
        small: {
            type: String,
            default: null
        },
        large: {
            type: String,
            default: null
        }
    },
    location: {
        country: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        }
    },
    contacts: {
        github: {
            type: String,
            default: null
        },
        facebook: {
            type: String,
            default: null
        },
        instagram: {
            type: String,
            default: null
        },
        twitter: {
            type: String,
            default: null
        },
        website: {
            type: String,
            default: null
        },
        youtube: {
            type: String,
            default: null
        },
        linkedin: {
            type: String,
            default: null
        }
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Session', schema)