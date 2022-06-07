
const express = require('express')
const app = express()
const port = process.env.PORT || 3500
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { expressCspHeader, INLINE, NONE, SELF } = require('express-csp-header')
const fs = require('fs')
const path = require('path')

// app.get('/', (req, res) => {
//     res.send('Hello from api!')
// })
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
        maxAge: null
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/chat',
        // mongoose_connection: mongoose.connection
    })
}))

// app.use('/test', (req, res, next) => {
//     req.session.some_________________ = 'skfjksdgjgossifsofsj--________________'
//     res.send('Visits: ' + req.session.some_________________)
// })

const routes = require('./settings/routes')
routes(app)

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})



// Route 
const User = require('./models/user')

app.use(express.json({ extended: true }))


const { Router } = require('express')
const router = Router()

const fileMiddleware = require('./middleware/file_img')
// app.use('/images', express.static(path.join(__dirname, 'files', 'images', 'avatar')))
let userAvatarDirectory = ''
app.use(`/files/images/avatar/${userAvatarDirectory}`, express.static(path.join(__dirname, 'files', 'images', 'avatar', userAvatarDirectory)))

router.post('/photo', fileMiddleware.single('avatar'), (req, res) => {

    const pathAvatar = path.join(__dirname, 'files/images/avatar', req.session.userId)
    console.log('fksdflsdfjskd: ' + pathAvatar)
    fs.readdir(pathAvatar, (err, files) => {
        if (err) throw err;

        for (const file of files) {
                if (file !== path.basename(req.file.path)) {
                    console.log('FILE: ' + file)
                    console.log('req.file.path____: ' + path.basename(req.file.path))
                fs.unlink(path.join(pathAvatar, file), (err) => {
                    if (err) throw err;
                    console.log('Картинка видалена');
                });
            }
        }
    })

        userAvatarDirectory = req.session.userId

        const photoUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path
        console.log('photourl: ' + photoUrl);
        try {
            if (req.file) {
                console.log(req.get('host'));
            console.log(photoUrl);
            console.log(req.originalUrl);
            console.log(req.file.path)
            
            res.json(req.file)
            
            User.findOneAndUpdate({ _id: req.session.userId }, {
                photos: {
                    large: photoUrl,
                    small: photoUrl,
                }
            
            }, (err, user) => {
            
                //if (err) next(err)

                res.json(res.data)
            })
            }
        } catch (err) {
            console.log(err);
        }
})
// Route 

app.use('/profile', router)
