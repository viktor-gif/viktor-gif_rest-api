'use strict'

exports.status = (values, res, statusCode) => {
    debugger
    const data = {
        "status": statusCode,
        "values": values
    }
    res.json(data)
    res.end()
}