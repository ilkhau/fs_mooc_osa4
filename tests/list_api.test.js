const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
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

beforeEach(async () => {
    logger.test('Deleting Blogs')
    await Blog.deleteMany({})

    let noteObject = new Blog(initialBlogs[0])
    await noteObject.save()

    noteObject = new Blog(initialBlogs[1])
    await noteObject.save()

    logger.test('Initial blogs stored to DB')
})

describe('Getting notes tests', () => {

    test('Getting all return JSON as content-type', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
    })

    test('All blogs are returned', async () => {
        const blogs = await api.get('/api/blogs')

        expect(blogs.body.length).toBe(initialBlogs.length)
    })

    test('Blogs are identified by id', async () => {
        const blogs = await api.get('/api/blogs')
        blogs.body.forEach(b => expect(b).toBeDefined())
    })
})

afterAll(() => {
    mongoose.connection.close()
})