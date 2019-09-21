const Blog = require('../models/blog')
const logger = require('../utils/logger')

const initialBlogs = [
    {
        title: 'Yle uriheilu',
        author: 'Kari Mänty',
        url: 'https://www.yle.fi/urheilu',
        likes: 5,
    },
    {
        title: 'Jatkoaika.com',
        author: 'Jatkoaika toimitus',
        url: 'https://www.jatkoaika.com',
        likes: 53,
    }
]

const logBlogs = async () => {
    const blogsAsJson = await blogsInDb()
    blogsAsJson.forEach(b => logger.test('Blog: ', b))
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'remove.com',
        author: 'removed',
        url: 'https://www.remove.me',
        likes: 53,
    })

    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

module.exports = {
    initialBlogs, logBlogs, blogsInDb, nonExistingId
}