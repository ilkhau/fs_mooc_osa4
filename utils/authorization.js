const logger = require('./logger')

const authorization = async (req, res, next) => {

    const tokenFromRequest = () => {
        const auth = req.get('authorization')
        if (auth && auth.toLowerCase().startsWith('bearer ') && auth.length > 7) {
            return auth.substring(7)
        }

        return null
    }

    const tokenDefined = (token) => {
        return token !== undefined && token !== null
    }

    try {
        const token = tokenFromRequest()

        if (tokenDefined(token)) {
            logger.info('Token found from request; ', token)
            req.token = token
        } else {
            req.token = null
        }
        next()
    } catch (e) {
        next(e)
    }
}

module.exports = {
    authorization
}