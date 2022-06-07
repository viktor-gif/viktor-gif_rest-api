const mongoose = require('mongoose')
mongoose.set('debug', true)

const mongoDB = 'mongodb://localhost:27017/chat'
mongoose.connect(mongoDB, (err) => {
    if (err) {
        console.log('Помилка підключення до бази даних')
    } else {
        console.log('Підключення до бази даних пройшло успішно :-)')
    }
})

mongoose.Promise = global.Promise

const db = mongoose.connection

// db.on('error', console.error.bind(console, 'MongoDB connection error'))

module.exports = db