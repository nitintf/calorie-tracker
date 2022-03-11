import moment from 'moment'
import * as faker from 'faker'
import * as _ from 'lodash'
import Food from './app/Food/food.entity'
import User from './app/User/user.entity'
import * as bcrypt from 'bcrypt'
import Category from './app/Category/category.entity'
import connectDb from './db/connect'

const categoriesName = [
	'lunch',
	'dinner',
	'breakfast',
	'dinner party',
	'snacks',
]

const seed = async () => {
	await connectDb()
	await Category.delete({})
	await Food.delete({})
	await User.delete({})

	for (let i = 1; i <= 5; i++) {
		const user = new User()
		user.id = i
		user.name = faker.name.firstName()
		user.admin = i === 1
		user.email = faker.internet.email().toLowerCase()
		user.password = bcrypt.hashSync('123456', 10)
		user.dailyCalorieLimit = 2100
		await user.save()
	}

	const users = await User.find({})
	for (let i = 1; i < 6; i++) {
		const category = new Category()
		category.id = i
		category.name = `${categoriesName[i - 1]}`
		category.maxFoodItems = Math.ceil(Math.random() * 5)
		await category.save()
	}

	const categories = await Category.find({})

	for (let i = 1; i < 70; i++) {
		const food = new Food()
		food.id = i
		food.user = _.sample(users)!
		const randomDay = Math.ceil(Math.random() * 100)
		const randDate = moment().subtract(randomDay, 'days')
		food.dateTime = randDate.format('YYYY-MM-DD HH:mm:ss')
		food.date = randDate.format('YYYY-MM-DD')
		food.name = `Food ${i}`
		food.calorie = Math.floor(Math.random() * 3000)

		food.category = _.sample(categories)!
		await food.save()
	}
}
seed().then(() => {
	console.log('Seed completed')
	process.exit(0)
})
