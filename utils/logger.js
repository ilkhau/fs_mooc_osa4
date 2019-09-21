const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params)
    }
}

const test = (...params) => {
    if (process.env.NODE_ENV === 'test') {
        console.log(...params)
    }
}

const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, test, error
}