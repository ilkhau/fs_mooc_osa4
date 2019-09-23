const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        validate: {
            validator: function (v) {
                return v !== undefined && v.length > 0
            },
            message: props => `${props.value} is not a valid!`
        }
    },
    name: {
        type: String,
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
    }
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
