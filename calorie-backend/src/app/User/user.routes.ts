import { Router } from 'express'
import currentUserMiddleware from '../../middlewares/currentUser.middleware'
import UserService from './user.service'

const router = Router()

router.post('/signup', UserService.signup)
router.post('/signin', UserService.signin)
router.get('/me', currentUserMiddleware, UserService.currentUser)

export default router
