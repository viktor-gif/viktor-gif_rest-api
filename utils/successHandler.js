module.exports = (res, status, message) => {
    res.status(status).json({
        resultCode: 2, // if resultCode === 2, success
        message
    })
}