import { fileTypeFromBuffer } from 'file-type'
import express from 'express'
import bodyParser from'body-parser'
import cookieParser from'cookie-parser'
import session from'express-session'
import { expressCspHeader, INLINE, NONE, SELF } from 'express-csp-header'
import MongoStore from 'connect-mongo'
import routes from './settings/routes'
import { type } from 'express/lib/response'

const port = process.env.PORT || 3500
const app = express()

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

app.use('/test', (req, res, next) => {
    req.session.some_________________ = 'skfjksdgjgossifsofsj--________________'
    res.send('Visits: ' + req.session.some_________________)
})

routes(app)

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})


// file-storage


