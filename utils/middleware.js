const morgan = require('morgan')
const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send( { error: 'malformatted id' } )
    } else if (error.name === 'ValidationError') {
        return response.status(400).json( { error: error.message } )
    }
    else if (error.name === 'Error') {
        response.status(400).json({ error: 'Request cannot be processed' })
    }
    next(error)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send( { error: 'unknown endpoint' } )
}

morgan.token('body', function (req) {
    return JSON.stringify(req.body)
})

const requestLogger = morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['body'](req, res)
    ].join(' ')
})

module.exports = {
    unknownEndpoint,
    errorHandler,
    requestLogger
}
