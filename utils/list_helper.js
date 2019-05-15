const totalLikes = ( blogs ) => {

    if (!blogs || blogs === undefined) {
        return 0
    }
    else if (blogs.length == 0) {
        return 0
    }

    return blogs.map(b => b.likes).reduce((t, c) => t + c)
}

module.exports = {
    totalLikes
}
