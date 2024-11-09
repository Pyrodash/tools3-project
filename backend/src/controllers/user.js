import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import { DetailedUserDTO } from '../dto/user.js'
import User from '../models/user.js'

const router = new Router()

router.use(authenticationMiddleware)

router.get('/@me', (req, res) => {
    res.send(new DetailedUserDTO(req.user)).end()
})

router.get('/driver/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.role !== 'driver') {
            return res.status(400).json({ message: 'User is not a driver' })
        }

        res.status(200).json(new DetailedUserDTO(user))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

export default router
