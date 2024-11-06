import { Router } from 'express'
import authController from './controllers/auth.js'
import userController from './controllers/user.js'
import orderController from './controllers/order.js'

const router = new Router()

router.use('/auth', authController)
router.use('/users', userController)
router.use('/orders', orderController)

export default router
