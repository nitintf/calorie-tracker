import { Router } from 'express'
import currentUserMiddleware from '../../middlewares/currentUser.middleware'
import isAdminMiddleware from '../../middlewares/isAdmin.middleware'
import FoodService from './food.service'

const router = Router()

router.post('/', currentUserMiddleware, FoodService.create)
router.put('/:id', currentUserMiddleware, FoodService.update)
router.get('/', currentUserMiddleware, FoodService.fetchAll)
router.delete('/:id', currentUserMiddleware, FoodService.delete)
router.get(
	'/reports',
	currentUserMiddleware,
	isAdminMiddleware,
	FoodService.reports
)

export default router
