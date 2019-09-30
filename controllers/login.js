const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const loginRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

loginRouter.post('/', async (request, response, next) => {

    try {
        const body = request.body

        const user = await User.findOne({username: body.username})

        if (user) {
            const pwdCorrect = await bcrypt.compare(body.password, user.passwordHash)
            if (pwdCorrect) {
                const userToken = {
                    username: user.username,
                    id: user._id
                }

                userToken.token = jwt.sign(userToken, config.SECRET)

                response
                    .status(200)
                    .send(userToken)

                return
            }
        }
        response
            .status(401)
            .json({
                error: 'Invalid username or password'
            })
    } catch (error) {
        logger.error('Error occured during login', error)
        next(error)
    }
})

module.exports = loginRouter