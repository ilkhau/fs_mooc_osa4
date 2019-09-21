const dotenv = require('dotenv')
const variableExpansion = require('dotenv-expand')
const expanded = dotenv.config()

variableExpansion(expanded)

const setConnectionString = () => {
    if (process.env === 'test') {
        return process.env.MONGO_CONNECTION_STRING_TEST
    } else if (process.env === 'dev') {
        return process.env.MONGO_CONNECTION_STRING_LOCAL
    }
    return process.env.MONGO_CONNECTION_STRING_REMOTE
}

let PORT = process.env.PORT
let MONGO_CONNECTION_STRING = setConnectionString()

module.exports = {
    MONGO_CONNECTION_STRING,
    PORT
}
