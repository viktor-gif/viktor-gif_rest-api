const express = require('express')
const app = express()
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header')
const fs = require('fs')
const path = require('path')

app.use(require('cors')())
app.use(expressCspHeader({
    policies: {
        'default-src': [NONE],
        'img-src': [SELF]
    }
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

const MongoStore = require('connect-mongo');

app.use(session({
    secret: "myApi",
    key: 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: "/",
        httpOnly: true,
        secure: false,
        maxAge: 86400000
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/chat',
        // mongoose_connection: mongoose.connection
    })
}))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(express.json({ extended: true }))

// Routes
app.use('/users', require('./settings/routes/users'))
app.use('/profile', require('./settings/routes/profile'))
app.use('/auth', require('./settings/routes/auth'))
app.use('/follow', require('./settings/routes/follow'))
app.use('/dialogs', require('./settings/routes/dialogs'))
app.use('/posts', require('./settings/routes/posts'))
app.use('/video', require('./settings/routes/commonVideo'))
// Routes

// Statics
let userAvatarDirectory = require('./controller/profile').userAvatarDirectory
console.log(userAvatarDirectory);
app.use(`/files/images/avatar/${userAvatarDirectory || ''}`, express.static(path.join(__dirname, 'files', 'images', 'avatar', userAvatarDirectory || '')))

app.use(`/files/images/posts`, express.static(path.join(__dirname, 'files', 'images', 'posts')))
app.use(`/files/video/posts`, express.static(path.join(__dirname, 'files', 'video', 'posts')))
app.use(`/files/audio/posts`, express.static(path.join(__dirname, 'files', 'audio', 'posts')))

app.use(`/files/images/dialogs`, express.static(path.join(__dirname, 'files', 'images', 'dialogs')))
app.use(`/files/video/dialogs`, express.static(path.join(__dirname, 'files', 'video', 'dialogs')))
app.use(`/files/audio/dialogs`, express.static(path.join(__dirname, 'files', 'audio', 'dialogs')))

app.use(`/files/images/comments`, express.static(path.join(__dirname, 'files', 'images', 'comments')))
app.use(`/files/video/comments`, express.static(path.join(__dirname, 'files', 'video', 'comments')))
app.use(`/files/audio/comments`, express.static(path.join(__dirname, 'files', 'audio', 'comments')))

app.use(`/files/video/common`, express.static(path.join(__dirname, 'files', 'video', 'common')))

module.exports = app