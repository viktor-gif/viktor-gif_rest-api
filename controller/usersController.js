'use strict'

const response = require('../response')
const db = require('../settings/db')

exports.users = (req, res) => {
    // const users = [
    //     {
    //         "id": 1,
    //         "name": "Alex"
    //     },
    //     {
    //         "id": 2,
    //         "name": "John"
    //     }
    // ]
    // response.status(users, res)

    db.query('SELECT * FROM `users`', (error, rows, fields) => {
        if (error) {
            console.log(error)
        } else {
            response.status(rows, res)
        }
    })
}
exports.login = (req, res) => {
    const sql = "SELECT `id`, `password`, `email` FROM `users` WHERE `password` = '" + req.query.password + "'"
    db.query(sql, (error, rows, fields) => {
        if (error) {
            console.log(error)
        } else {
            response.status(rows, res)
        }
    })
    console.log(req)
}

// exports.add = (req, res) => {
//     const sql = "INSERT INTO `users`(`name`, `surname`, `status`) VALUES()"
//     console.log(req.query)
// }

exports.add = (req, res) => {
    const sql = "INSERT INTO `users`(`name`, `email`, `password`) VALUES('" + req.query.name + "', '" + req.query.email + "', '" + req.query.password + "')"
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            response.status(result, res)
        }
    })
}
exports.updateUserStatus = (req, res) => {
    const sql = 'UPDATE `users` SET `status`="' + req.query.status + '" WHERE `id`=2'
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error)
        } else {
            response.status(result, res)
        }
    })
}