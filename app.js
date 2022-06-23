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
// Routes

let userAvatarDirectory = require('./controller/profile').userAvatarDirectory
console.log(userAvatarDirectory);
app.use(`/files/images/avatar/${userAvatarDirectory || ''}`, express.static(path.join(__dirname, 'files', 'images', 'avatar', userAvatarDirectory || '')))

module.exports = app