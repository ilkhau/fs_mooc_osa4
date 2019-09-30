const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const logger = require('../utils/logger')
const User = require('../models/user')
const config = require('../utils/config')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {

    const validateRequest = (request) => {
        const body = request.body
        if(body.password === undefined || body.password.length < config.PWD_MIN_LENGTH) {
            throw new SyntaxError(`Password needs to be at least ${config.PWD_MIN_LENGTH}  characters long`)
        }

        if(body.username === undefined || body.username.length < config.USERNAME_MIN_LENGTH) {
            throw new SyntaxError(`Username needs to be at least ${config.USERNAME_MIN_LENGTH}  characters long`)
        }
    }

    const contentToUser = async (request) => {
        const body = request.body
        const pwd = await bcrypt.hash(body.password , config.SALT_ROUNDS)
        return new User({
            username: body.username || '',
            name: body.name || '',
            passwordHash: pwd || '',
        })
    }

    try {
        validateRequest(request)
        const user = await contentToUser(request)
        const result = await user.save()
        response.status(201).json(result)
    } catch (error) {
        logger.error('Error storing new user: ', error)
        next(error)
    }
})

module.exports = usersRouter
