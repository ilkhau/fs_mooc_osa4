const helper = require('./test_helper')
const listHelper = require('../utils/list_helper')

describe( 'total likes', () => {

    test('Should count likes correctly', () => {
        expect(listHelper.totalLikes(helper.initialBlogs)).toBe(36)
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

        expect(listHelper.favoriteBlog(helper.initialBlogs)).toEqual(expected)
    })
})

describe('most blogs', () => {

    test('Should return author with most blogs', () => {
        const expected = {
            author: 'Robert C. Martin',
            blogs: 3
        }

        expect(listHelper.mostBlogs(helper.initialBlogs)).toEqual(expected)
    })
})


describe('most likes', () => {

    test('Should return author with most likes', () => {
        const expected = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }

        expect(listHelper.mostLikes(helper.initialBlogs)).toEqual(expected)
    })
})