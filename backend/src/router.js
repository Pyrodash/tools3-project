import { Router } from 'express'
import authController from './controllers/auth.js'
import userController from './controllers/user.js'

const router = new Router()

router.use('/auth', authController)
router.use('/users', userController)

export default router
