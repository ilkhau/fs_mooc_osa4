const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogs = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const mongoUrl = config.MONGO_CONNECTION_STRING

mongoose.connect(mongoUrl, { useNewUrlParser: true } )
    .then(() => {
        logger.info('Connected to database')
    }).catch(err => {
        logger.error(`DB connection error: ${err.message}`)
    })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogs)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
