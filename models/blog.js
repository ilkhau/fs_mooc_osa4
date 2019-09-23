const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        validate: {
            validator: function (v) {
                return v !== undefined && v.length > 0
            },
            message: props => `${props.value} is not a valid title!`
        }
    },
    author: String,
    url: {
        type: String,
        validate: {
            validator: function (v) {
                return v !== undefined && v.length > 0
            },
            message: props => `${props.value} is not a valid url!`
        }
    },
    likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)
