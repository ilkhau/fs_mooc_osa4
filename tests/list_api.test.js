const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const logger = require('../utils/logger')
const helper = require('./test_helper')

beforeEach(async () => {
    logger.test('Deleting Blogs')
    await Blog.deleteMany({})

    await helper.initialBlogs
        .forEach(async (b) => {
            let blog = new Blog(b)
            await blog.save()
            logger.test('Blog saved to DB: ', blog)
        })
})

describe('Getting notes tests', () => {

    test('Getting all return JSON as content-type', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
    })

    test('All blogs are returned', async () => {
        const blogs = await api.get('/api/blogs')

        expect(blogs.body.length).toBe(helper.initialBlogs.length)
    })

    test('Blogs are identified by id', async () => {
        const blogs = await api.get('/api/blogs')
        blogs.body.forEach(b => expect(b).toBeDefined())
    })
})

describe('Adding new notes', () => {
    test('Add new note succesfully', async () => {

        const newBlog = {
            title: 'MTV uriheilu',
            author: 'Petteri Lehto',
            url: 'https://www.mtv3.fi/urheilu',
            likes: 55,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')

        const blogs = await api.get('/api/blogs')
        const blogsInDb = await helper.blogsInDb()
        expect(blogs.body.length).toBe(blogsInDb.length)

        const urls = blogs.body.map(b => b.url)
        expect(urls).toContain(newBlog.url)
    })

    test('Likes set automatically to 0', async () => {

        const newBlog = {
            title: 'MTV uriheilu',
            author: 'Petteri Lehto',
            url: 'https://www.mtv3.fi/urheilu'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const blog = await Blog.findOne({ title: newBlog.title })
        expect(blog.likes).toBe(0)
    })

    test('Cannot add with empty url', async () => {
        const newBlog = {
            title: 'MTV uriheilu',
            author: 'Petteri Lehto'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogs = await api.get('/api/blogs')
        expect(blogs.body.length).toBe(helper.initialBlogs.length)

    })

    test('Cannot add with empty title', async () => {
        const newBlog = {
            author: 'Petteri Lehto',
            url: 'https://www.mtv3.fi/urheilu'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogs = await api.get('/api/blogs')
        expect(blogs.body.length).toBe(helper.initialBlogs.length)

    })
})

afterAll(() => {
    mongoose.connection.close()
})