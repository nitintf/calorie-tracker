import logger from '../helpers/logger'
import { createConnection } from 'typeorm'
import User from '../app/User/user.entity'
import Food from '../app/Food/food.entity'
import Category from '../app/Category/category.entity'

const connectDb = async () => {
	await createConnection({
		type: 'sqlite',
		database: 'db.sqlite',
		entities: [User, Food, Category],
		synchronize: true,
		logging: false,
	})
		.then(() => {
			logger.info('Database connected')
		})
		.catch((err) => {
			logger.error(err)
		})
}

export default connectDb
