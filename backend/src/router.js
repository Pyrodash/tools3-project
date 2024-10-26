import { Router } from 'express'
import authController from './controllers/auth.js'

const router = new Router()

router.use('/auth', authController)

export default router
