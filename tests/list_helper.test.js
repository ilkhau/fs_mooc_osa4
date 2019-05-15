const listHelper = require('../utils/list_helper')

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }]

describe( 'total likes', () => {

    test('Should count likes correctly', () => {
        expect(listHelper.totalLikes(blogs)).toBe(36)
    })

    test('Should return 0 when empty list passed', () => {
        expect(listHelper.totalLikes([])).toBe(0)

    })

    test('Should return 0 when null passed', () => {
        expect(listHelper.totalLikes(null)).toBe(0)
    })

    test('Should return 0 when undefined passed', () => {
        expect(listHelper.totalLikes(undefined)).toBe(0)
    })
})

describe('favourite blog', () => {

    test('Should return blog with most likes', () => {
        const expected = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12
        }

        expect(listHelper.favoriteBlog(blogs)).toEqual(expected)
    })
})

describe('most blogs', () => {

    test('Should return author with most blogs', () => {
        const expected = {
            author: 'Robert C. Martin',
            blogs: 3
        }

        expect(listHelper.mostBlogs(blogs)).toEqual(expected)
    })
})


describe('most likes', () => {

    test('Should return author with most likes', () => {
        const expected = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }

        expect(listHelper.mostLikes(blogs)).toEqual(expected)
    })
})