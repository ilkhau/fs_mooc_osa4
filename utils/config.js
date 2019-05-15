const dotenv = require('dotenv')
const variableExpansion = require('dotenv-expand')
const expanded = dotenv.config()
variableExpansion(expanded)

let PORT = process.env.PORT
let MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING

console.log(`${MONGO_CONNECTION_STRING}`)

module.exports = {
    MONGO_CONNECTION_STRING,
    PORT
}
