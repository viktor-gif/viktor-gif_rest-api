module.exports = (res, status, message) => {
    res.status(status).json({
        resultCode: 4, // if resultCode === 4, user-error(400-errors)
        message
    })
}