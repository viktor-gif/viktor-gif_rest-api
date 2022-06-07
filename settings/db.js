const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'viktor_gif'
})

connection.connect((error) => {
    if (error) {
        console.log('Ошибка подключения к БД')
    } else {
        console.log('Подключение успешно!')
    }
})

module.exports = connection