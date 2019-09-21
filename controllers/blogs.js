const blogsRouter = require('express').Router()
const logger = require('../utils/logger')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {

    const validate = (blog) => {
        if(blog.url === undefined || blog.url.length === 0) {
            logger.error('Blog url is empty or undefined')
            return false
        }

        if(blog.title === undefined || blog.title.length === 0) {
            logger.error('Blog title is empty or undefined')
            return false
        }

        return true
    }

    const body = request.body
    const blog = new Blog({
        title: body.title || '',
        author: body.author || '',
        url: body.url || '',
        likes: body.likes || 0,
    })

    if ( !validate(blog)) {
        logger.error('Blog is not valid: ', blog)
        response.status(400).json({ error: 'Blog is not valid' })
        return
    } else {
        const result = await blog.save()
        response.status(201).json(result)
    }
})

module.exports = blogsRouter
