const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
        validate: {
            validator: function (v) {
                return v !== undefined && v.length > 0
            },
            message: props => `${props.value} is not a valid!`
        }
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        validate: {
            validator: function (v) {
                return v !== undefined && v.length > 0
            },
            message: props => `${props.value} is not a valid!`
        }
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return v !== undefined && v.length > 0
            },
            message: props => `${props.value} is not a valid!`
        }
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.password
    }
})

module.exports = mongoose.model('User', userSchema)
