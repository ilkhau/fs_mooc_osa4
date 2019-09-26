const dotenv = require('dotenv')
const variableExpansion = require('dotenv-expand')
const expanded = dotenv.config()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

variableExpansion(expanded)

const setConnectionString = () => {
    if (process.env.NODE_ENV === 'test') {
        return process.env.MONGO_CONNECTION_STRING_LOCAL
    } else if (process.env.NODE_ENV === 'dev') {
        return process.env.MONGO_CONNECTION_STRING_LOCAL
    }
    return process.env.MONGO_CONNECTION_STRING_REMOTE
}

let PORT = process.env.PORT
let MONGO_CONNECTION_STRING = setConnectionString()
let SALT_ROUNDS = process.env.SALT_ROUNDS || 10
let SECRET = process.env.SECRET || 'demosecret'
let PWD_MIN_LENGTH = 3
let USERNAME_MIN_LENGTH = 3

module.exports = {
    MONGO_CONNECTION_STRING,
    PORT,
    SALT_ROUNDS,
    SECRET,
    PWD_MIN_LENGTH,
    USERNAME_MIN_LENGTH
}
