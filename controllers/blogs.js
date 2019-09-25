const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {

    const contentToBlog = (request, userId) => {
        const body = request.body
        return new Blog({
            title: body.title || '',
            author: body.author || '',
            url: body.url || '',
            likes: body.likes || 0,
            user: userId
        })
    }

    const users = await User.find({})
    const blog = contentToBlog(request, users[0]._id)

    try {
        const result = await blog.save()
        logger.info('Blog stored to DB: ', result)
        response.status(201).json(result)
    } catch (error) {
        logger.error('Error storing new blog: ', error)
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
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

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        await Blog.findOneAndRemove({ _id: request.params.id })
        response.status(204).end()
    } catch (error) {
        logger.error('Error deleting blog: ', error)
        next(error)
    }
})

module.exports = blogsRouter
