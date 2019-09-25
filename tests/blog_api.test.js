const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')

beforeEach(async () => {
    await helper.storeBlogsAndUsersToDb()
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

    test('Blog contains populated user', async() => {
        const blogs = await api.get('/api/blogs')
        blogs.body.map(b => b.user).forEach(u => expect(u).toBeDefined())
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

        const blog = await Blog.findOne({title: newBlog.title})
        expect(blog.likes).toBe(0)
    })

    test('Blog contains user', async () => {
        const newBlog = {
            title: 'MTV uriheilu',
            author: 'Petteri Lehto',
            url: 'https://www.mtv3.fi/urheilu'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const blog = await Blog.findOne({title: newBlog.title})
        expect(blog.likes).toBe(0)
        expect(blog.user).toBeDefined()
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

describe('Deleting blogs', () => {
    test('Deletes blog succesfully', async () => {

        const blogs = await helper.blogsInDb()

        await api
            .delete(`/api/blogs/${blogs[0].id}`)
            .expect(204)

        const updatedBlogs = await api.get('/api/blogs')
        expect(updatedBlogs.body.length).toBe(helper.initialBlogs.length - 1)
        expect(updatedBlogs.body).toEqual(expect.not.stringMatching(blogs[0].title))
    })
})


describe('Updates blog correctly', () => {
    test('Likes are updated', async () => {

        const blogs = await helper.blogsInDb()
        const updatedLikes = blogs[0].likes + 10
        const res = await api
            .put(`/api/blogs/${blogs[0].id}`)
            .send({likes: updatedLikes})
            .expect(200)

        expect(res.body.likes).toBe(updatedLikes)
    })

    test('Cannot update nonexisting', async () => {

        const blogs = await helper.nonExistingId()
        const updatedLikes = 10
        await api
            .put(`/api/blogs/${blogs[0].id}`)
            .send({likes: updatedLikes})
            .expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})