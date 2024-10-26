import express from 'express'
import { body } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import validate from '../middleware/validate.js'
import { bcrypt_salt_rounds, jwt_expiry_time, jwt_secret } from '../config.js'
import { DetailedUserDTO } from '../dto/user.js'

const router = express.Router()

const sendError = (statusCode, message, res) => {
    return res
        .status(statusCode)
        .send({
            errors: [{ msg: message }],
        })
        .end()
}

const sendForbidden = (res) => {
    return sendError(403, 'Invalid email or password', res)
}

const loginValidator = validate([
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
])

const registerValidator = validate([
    body('name').isString().notEmpty().withMessage('Name cannot be empty'),
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
    body('phone')
        .isMobilePhone()
        .withMessage('Phone must be a valid phone number'),
])

export const login = (user, res) => {
    const token = jwt.sign({ id: user.id }, jwt_secret, {
        expiresIn: jwt_expiry_time,
    })

    return res.status(200).send({
        token,
        user: new DetailedUserDTO(user),
    })
}

router.post('/login', loginValidator, async (req, res, _next) => {
    const user = await User.findOne({ email: req.body.email })
    const password = req.body.password

    if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (isValidPassword) {
            return login(user, res)
        } else {
            return sendForbidden(res)
        }
    } else {
        return sendForbidden(res)
    }
})

router.post('/register', registerValidator, async (req, res) => {
    const existingUser = await User.findOne({ email: req.body.email })

    if (!existingUser) {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            password: await bcrypt.hash(req.body.password, bcrypt_salt_rounds),
        })

        await user.save()

        return login(user, res)
    } else {
        return sendError(
            400,
            'An account already exists with the same email.',
            res,
        )
    }
})

export default router
