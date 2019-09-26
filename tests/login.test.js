const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const each = require('jest-each').default

beforeEach(async () => {
    await helper.storeBlogsAndUsersToDb()
})

describe('Login tests', () => {
    test('User is able to login', async () => {
        const loginData = {
            username: helper.initialUsers[0].username,
            password: helper.initialUsers[0].password
        }

        const response = await api
            .post('/api/login')
            .send(loginData)
            .expect(200)

        expect(response.body.username).toBe(loginData.username)
        expect(response.body.token).toBeDefined()
    })

    test('User is not able to login with incorrect password', async () => {
        const loginData = {
            username: helper.initialUsers[0].username,
            password: 'wrong'
        }

        await api
            .post('/api/login')
            .send(loginData)
            .expect(401)

    })

    test('User is not able to login with nonexsistent user', async () => {
        const loginData = {
            username: 'nonexists',
            password: helper.initialUsers[0].password
        }

        await api
            .post('/api/login')
            .send(loginData)
            .expect(401)

    })

    test('User is not able to login with undefined password', async () => {
        const loginData = {
            username: helper.initialUsers[0].username,
        }

        await api
            .post('/api/login')
            .send(loginData)
            .expect(400)

    })

    test('User is not able to login with undefined username', async () => {
        const loginData = {
            password: helper.initialUsers[0].password
        }

        await api
            .post('/api/login')
            .send(loginData)
            .expect(401)

    })
})