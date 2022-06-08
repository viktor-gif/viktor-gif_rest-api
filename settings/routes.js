'use strict'


module.exports = (app) => {
    // const usersController = require('../controller/usersController')
    const usersControllerMongo = require('../controller/usersController_mongo')

    app.route('/').get((req, res) => { res.write("<h1>Home page opened!!!</h1>") })
    app.route('/auth/login').post(usersControllerMongo.login)
    app.route('/auth/login').delete(usersControllerMongo.logout)
    app.route('/auth/me').get(usersControllerMongo.me)
    app.route('/users').get(usersControllerMongo.users)
    app.route('/users/add').post(usersControllerMongo.add)
    app.route('/profile/:userId').get(usersControllerMongo.userProfile)
    app.route('/status/:userId').get(usersControllerMongo.userStatus)
    app.route('/profile').put(usersControllerMongo.updateProfile)
    app.route('/profile/status').put(usersControllerMongo.updateStatus)
    app.route('/follow').post(usersControllerMongo.setFollow)

    
}