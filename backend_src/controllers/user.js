import { Router } from 'express'
import authenticationMiddleware from '../middleware/authentication.js'
import { DetailedUserDTO } from '../dto/user.js'

const router = new Router()

router.use(authenticationMiddleware)

router.get('/@me', (req, res) => {
    res.send(new DetailedUserDTO(req.user)).end()
})

export default router
