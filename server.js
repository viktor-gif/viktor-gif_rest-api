
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
app.use('/images', express.static(path.join(__dirname, 'images')))

const { Router } = require('express')
const router = Router()
const fileMiddleware = require('./middleware/file_img')

router.post('/photo', fileMiddleware.single('avatar'), (req, res) => {
  const photoUrl = req.protocol + '://' + req.get('host') + '/' + req.file.path
    try {
        if (req.file) {
            console.log(req.get('host'));
        console.log(photoUrl);
        console.log(req.originalUrl);
        console.log(req.file.path)
        // fs.mkdir(path.join(__dirname, 'files', 'images', 'avatar', req.session.userId), (err) => {
        //     if (err) {
        //         if (err.code === 'EEXIST') {
        //             console.log('Already exists')
        //         } else {
        //             console.log(err);
        //         }
            
        //     };
        // })
        res.json(req.file)
      
        User.findOneAndUpdate({ _id: req.session.userId }, {
            photos: {
                large: photoUrl,
                small: photoUrl,
            }
    
        }, (err, user) => {
    
            if (err) next(err)

            res.json(res.data)
        })
        }
    } catch (err) {
        console.log(err);
    }
})
// Route 

app.use('/profile', router)
