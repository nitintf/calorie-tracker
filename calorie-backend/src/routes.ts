import userRoutes from './app/User/user.routes'
import categoryRoute from './app/Category/category.routes'
import FoodRoute from './app/Food/food.routes'
import { Router } from 'express'

const router = Router()

router.use('/auth', userRoutes)
router.use('/category', categoryRoute)
router.use('/foods', FoodRoute)

export default router
