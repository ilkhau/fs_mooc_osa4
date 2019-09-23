const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const logger = require('../utils/logger')
const User = require('../models/user')
const config = require('../utils/config')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {

    const contentToUser = async (request) => {
        const body = request.body
        const pwd = await bcrypt.hash(body.password , config.SALT_ROUNDS)
        return new User({
            username: body.username || '',
            name: body.name || '',
            password: pwd || '',
        })
    }

    try {
        const user = await contentToUser(request)
        const result = await user.save()
        response.status(201).json(result)
    } catch (error) {
        logger.error('Error storing new user: ', error)
        next(error)
    }
})

/*
usersRouter.put('/:id', async (request, response, next) => {
    try{

        const body = request.body
        const updated = {
            likes: body.likes,
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            { _id: request.params.id },
            updated,
            { new: true })

        logger.info('Updated: ', updatedBlog)
        response.json(updatedBlog.toJSON())

    } catch (error) {
        logger.error('Error Updating blog count blog: ', error)
        next(error)
    }
})

usersRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findOneAndRemove({ _id: request.params.id })
        response.status(204).end()
    } catch (error) {
        logger.error('Error deleting blog: ', error)
        next(error)
    }
})
*/
module.exports = usersRouter
