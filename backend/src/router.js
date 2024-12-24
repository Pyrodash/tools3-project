import { Router } from 'express'
import authController from './controllers/auth.js'
import userController from './controllers/user.js'
import orderController from './controllers/order.js'
import adminController from './controllers/admin.js'
import courierController from './controllers/courier.js'

const router = new Router()

router.use('/api/auth', authController)
router.use('/api/users', userController)
router.use('/api/orders', orderController)
router.use('/api/admin', adminController)
router.use('/api/courier', courierController)

export default router
