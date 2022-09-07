const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const crypto = require('crypto')
const { stringify } = require('querystring')

const followersSchema = new Schema({
    userId: {
        type: String,
        required: true
    }, 
    friendStatus: {
        type: String,
        default: 'unfollowed'
    }
})

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
    followers: [followersSchema],
    imgIds: [{type: String}],
    videoIds: [{type: String}],
    audioIds: [{type: String}],
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
})

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
}

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password
        this.salt = Math.random() + ''
        this.hashedPassword = this.encryptPassword(password)
    })
    .get(function () { return this._plainPassword })
    
schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword
}

exports.user = mongoose.model('user', schema)