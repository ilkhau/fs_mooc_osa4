const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const each = require('jest-each').default;

beforeEach(async () => {
    await helper.storeBlogsAndUsersToDb()
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

    test('Blogs are not empty when user has creted blog', async () => {
        const users = await api.get('/api/users')
        users.body.map(u => u.blogs).forEach(b => expect(b).toBeDefined())
    })
})

describe('Adding new user', () => {
    test('Add new user succesfully', async () => {

        const newUser = {username: 'newuser', name: 'New User', password: 'password'}

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', 'application/json; charset=utf-8')

        const usersInDb = await helper.usersInDb()
        expect(usersInDb.length).toBe(helper.initialUsers.length + 1)
    })
})

describe('Password validation', () => {
    each([{
        pwd: undefined,
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        pwd: '',
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        pwd: 'a',
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        pwd: 'ab',
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        pwd: 'abc',
        result: 201,
        dbSize: helper.initialUsers.length + 1
    }]).test('Validates password correctly', async (arg) => {

        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: arg.pwd
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(arg.result)

        const usersInDb = await helper.usersInDb()
        expect(usersInDb.length).toBe(arg.dbSize)
    })
})
describe('Username validation', () => {
    each([{
        username: undefined,
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        username: '',
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        username: 'a',
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        username: 'ab',
        result: 400,
        dbSize: helper.initialUsers.length
    }, {
        username: 'abc',
        result: 201,
        dbSize: helper.initialUsers.length + 1
    }]).test('Validates username correctly', async (arg) => {

        const newUser = {
            username: arg.username,
            name: 'New User',
            password: 'arg.pwd'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(arg.result)

        const usersInDb = await helper.usersInDb()
        expect(usersInDb.length).toBe(arg.dbSize)
    })

    test('Cannot add with existing username', async () => {

        const usersInDb = await helper.usersInDb()

        const newUser = {
            username: usersInDb[0].username,
            name: 'New User',
            password: 'arg.pwd'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const users = await api.get('/api/users')

        expect(users.body.length).toBe(helper.initialUsers.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})