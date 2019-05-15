const lodash = require('lodash')

const totalLikes = ( blogs ) => {

    if (!blogs || blogs === undefined || blogs.length === 0) {
        return 0
    }

    return blogs.map(b => b.likes).reduce((t, c) => t + c)
}

const favoriteBlog = (blogs) => {

    const favourite = blogs.reduce((l, r) => {
        if (l.likes > r.likes) {
            return l
        }

        return r
    })

    return {
        title: favourite.title,
        author: favourite.author,
        likes: favourite.likes
    }
}

const mostBlogs = (blogs) => {

    return lodash.chain(blogs).groupBy('author')
        .map((authorBlogs, author) => {
            return { author: author, blogs: authorBlogs.length } })
        .value()
        .reduce((l,r) => { if (l.blogs > r.blogs) {
            return l
        }
        return r
        })
}

const mostLikes = (blogs) => {

    return lodash.chain(blogs).groupBy('author')
        .map((authorBlogs, author) => {
            return { author: author, likes: authorBlogs.map(b => b.likes).reduce((l,r) => l+r)
            } })
        .value()
        .reduce((l,r) => { if (l.likes > r.likes) {
            return l
        }
        return r
        })
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
