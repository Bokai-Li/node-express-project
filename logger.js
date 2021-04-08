function log(req, res, next) {
    console.log('Logging: Received a request...')
    next()
}

module.exports = log