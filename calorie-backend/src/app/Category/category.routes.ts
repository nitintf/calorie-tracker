import { Router } from 'express'
import currentUserMiddleware from '../../middlewares/currentUser.middleware'
import isAdminMiddleware from '../../middlewares/isAdmin.middleware'
import CategoryService from './category.service'

const router = Router()

router.put(
	'/:id',
	currentUserMiddleware,
	isAdminMiddleware,
	CategoryService.update
)
router.post(
	'/',
	currentUserMiddleware,
	isAdminMiddleware,
	CategoryService.create
)
router.get('/', currentUserMiddleware, CategoryService.fetchAll)
router.delete(
	'/:id',
	currentUserMiddleware,
	isAdminMiddleware,
	CategoryService.delete
)

export default router
