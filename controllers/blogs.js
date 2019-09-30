const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')
const jwt = require('jsonwebtoken')

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

    try {

        const decodedToken = jwt.verify(request.token, config.SECRET)
        const user = await User.findById(decodedToken.id)
        const blog = contentToBlog(request, user._id)
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        const storedUsed = await user.save()

        logger.info('Blog stored to DB: ', result)
        logger.info('User update in DB: ', storedUsed)

        response.status(201).json(result.toJSON())
    } catch (error) {
        logger.error('Error storing new blog: ', error)
        next(error)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
    try {

        const body = request.body
        const updated = {
            likes: body.likes,
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            {_id: request.params.id},
            updated,
            {new: true})

        logger.info('Updated: ', updatedBlog)
        response.json(updatedBlog.toJSON())

    } catch (error) {
        logger.error('Error Updating blog count blog: ', error)
        next(error)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {


    const validateBlogAndUser = (blog, user) => {
        return user !== undefined && user !== null && blog !== undefined && blog !== null &&
            blog.user._id.toString() === user._id.toString()
    }

    try {
        const decodedToken = jwt.verify(request.token, config.SECRET)
        const user = await User.findById(decodedToken.id)
        const blog = await Blog.findById({_id: request.params.id})

        if (!validateBlogAndUser(blog, user)) {
            response.status(401).json({error: 'Cannot delete only own blogs'})
        } else {
            user.blogs = user.blogs.filter(b => b._id.toString() !== blog._id.toString())

            await blog.delete()
            await user.save()

            response.status(204).end()
        }
    } catch (error) {
        logger.error('Error deleting blog: ', error)
        next(error)
    }
})

module.exports = blogsRouter
