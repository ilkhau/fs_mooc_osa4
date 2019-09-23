const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)
const logger = require('../utils/logger')
const helper = require('./test_helper')

beforeEach(async () => {
    logger.test('Deleting Blogs')
    await User.deleteMany({})

    const storedUsers = await helper.initialUsers
        .map(u => new User(u))
        .map(async (u) => {
            const stored = await u.save()
            logger.test('User stored to DB: ', stored)
        })

    await Promise.all(storedUsers)
    const users = await User.find({})
    logger.test(`Initialization done ==> ${users.length} users stored to database`)
})

describe('Getting users', () => {

    test('Getting all return JSON as content-type', async () => {
        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
    })

    test('All users are returned', async () => {
        const users = await api.get('/api/users')

        expect(users.body.length).toBe(helper.initialUsers.length)
    })

    test('Users are identified by id', async () => {
        const users = await api.get('/api/users')
        users.body.forEach(u => expect(u).toBeDefined())
    })
})

describe('Adding new user', () => {
    test('Add new user succesfully', async () => {

        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')

        const usersInDb = await helper.usersInDb()
        expect(usersInDb.length).toBe(helper.initialUsers.length + 1)
    })

  /*  test('Likes set automatically to 0', async () => {

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
*/

    test('Cannot add user with undefined password', async () => {
        const newUser = {
            username: 'newuser',
            name: 'New User'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersInDb = await helper.usersInDb()
        expect(usersInDb.length).toBe(helper.initialUsers.length)
    })
})
/*
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
            .send({ likes: updatedLikes })
            .expect(200)

        expect(res.body.likes).toBe(updatedLikes)
    })

    test('Cannot update nonexisting', async () => {

        const blogs = await helper.nonExistingId()
        const updatedLikes = 10
        await api
            .put(`/api/blogs/${blogs[0].id}`)
            .send({ likes: updatedLikes })
            .expect(400)
    })
})
*/
afterAll(() => {
    mongoose.connection.close()
})