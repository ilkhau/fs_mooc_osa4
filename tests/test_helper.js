const bcrypt = require('bcrypt')
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

const storeBlogsAndUsersToDb = async () => {
    logger.test('Deleting Blogs')

    await Blog.deleteMany({})
    await User.deleteMany({})

    const storedUsers = await initialUsers
        .map(u => new User({
            username: u.username,
            name: u.name,
            passwordHash: bcrypt.hashSync(u.password, config.SALT_ROUNDS)
        }))
        .map(async (u) => {
            const stored = await u.save()
            logger.test('User stored to DB: ', stored)
        })

    await Promise.all(storedUsers)
    const users = await User.find({})

    const storedBlogs = users
        .map((u, i) => new Blog({
            title: initialBlogs[i].title,
            author: initialBlogs[i].author,
            url: initialBlogs[i].url,
            likes: initialBlogs[i].likes,
            user: u._id
        }))
        .map(async (b) => {
            const stored = await b.save()
            logger.test('Blog stored to DB: ', stored)
        })

    await Promise.all(storedBlogs)
    const blogs = await Blog.find({})
    logger.test(`Initialization done ==> ${blogs.count} blogs stored to database`)
}

const initialUsers = [
    {
        username: 'mattiv',
        name: 'Matti Virtanen',
        password: '234234234243'
    },
    {
        username: 'maijameik',
        name: 'Maija Meikäläinen',
        password: '234234234243'
    },
    {
        username: 'oskariolem',
        name: 'Oskari Olematon',
        password: '234234234243'
    },
    {
        username: 'elmerik',
        name: 'Elmeri Iloinen',
        password: '234234234243'
    },
    {
        username: 'johndoe',
        name: 'Tuntematon Sotilas',
        password: '234234234243'
    },
    {
        username: 'kk_kaput',
        name: 'Rikki Ehjä',
        password: '234234234243'
    }
]

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
    }]

const logUsers = async () => {
    const usersAsJson = await usersInDb()
    usersAsJson.forEach(b => logger.test('User: ', b))
}

const logBlogs = async () => {
    const blogsAsJson = await blogsInDb()
    blogsAsJson.forEach(b => logger.test('Blog: ', b))
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b => b.toJSON())
}

const nonExistingUserId = async () => {
    const user = new User({
        username: 'remove.com',
        name: 'removed',
        password: 'https://www.remove.me'
    })

    await user.save()
    await user.remove()

    return user._id.toString()
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
    storeBlogsAndUsersToDb,
    initialBlogs, logBlogs, blogsInDb, nonExistingId,
    initialUsers, logUsers, usersInDb, nonExistingUserId
}