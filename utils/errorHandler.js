module.exports = (res, err) => {
    res.status(500).json({
        resultCode: 5, // if resultCode === 5, server-error
        message: err.message ? err.message : error
    })
}