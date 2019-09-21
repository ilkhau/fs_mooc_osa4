const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const logger = require('../utils/logger')
const helper = require('./test_helper')
const config = require('../utils/config')

beforeEach(async () => {
    logger.test('Config: ', config)
    logger.test('Deleting Blogs')
    await Blog.deleteMany({})

    helper.initialBlogs
        .map(b => new Blog(b))
        .forEach(async (b) => await b.save())

    logger.test('Initial blogs stored to DB')
    helper.logBlogs()
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
})

afterAll(() => {
    mongoose.connection.close()
})