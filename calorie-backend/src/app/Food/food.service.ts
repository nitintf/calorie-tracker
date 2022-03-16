import { Request, Response } from 'express'
import moment, { MomentInput } from 'moment'
import { Between, FindCondition, getRepository, LessThan } from 'typeorm'
import { PAGE_SIZE } from '../../constants'
import { errorResponse } from '../../helpers/response'
import Category from '../Category/category.entity'
import Food from './food.entity'
import {
	createFoodSchema,
	fetchAllFoodSchema,
	updateFoodSchema,
} from './food.schema'
import User from '../User/user.entity'

type ReportT = {
	today: number
	thisWeek: number
	lastWeek: number
}

export default class FoodService {
	static async create(req: Request, res: Response) {
		const { name, categoryId, calorie, dateTime, userId } = req.body
		const { error } = createFoodSchema.validate(req.body)
		const date = moment(req.body.dateTime).format('YYYY-MM-DD')

		if (error) {
			return res.status(400).send(error.details)
		}

		if (date > moment(Date.now()).format('YYYY-MM-DD')) {
			return errorResponse(res, 'Invalid date')
		}
		try {
			const category = await Category.findOne(categoryId)

			if (!category) return errorResponse(res, 'Category not found', 404)

			const user = await User.findOne(userId)

			if (!user) return errorResponse(res, 'User not found', 404)

			const foodsCount = await Food.count({
				where: {
					categoryId,
					userId: userId ?? req.currentUser.id,
					date: moment(new Date()).format('YYYY-MM-DD'),
				},
			})

			if (foodsCount >= category.maxFoodItems) {
				return errorResponse(
					res,
					`${category.name.toUpperCase()} Max limit reached please select another category`
				)
			}

			const food = Food.create()
			food.calorie = calorie
			food.name = name
			food.dateTime = dateTime
			food.categoryId = categoryId
			food.userId = userId
			food.date = date

			await Food.save(food)
			return res.status(201).json(food)
		} catch (error) {
			return res.status(500).send(error)
		}
	}

	static async fetchAll(req: Request, res: Response) {
		try {
			const { currentUser } = req
			let { page, startDate, endDate } = req.query

			const { error } = fetchAllFoodSchema.validate({
				page,
				startDate,
				endDate,
			})

			if (error) {
				return res.status(400).send(error.details)
			}

			const query: FindCondition<Food> = {}

			if (+page < 1) page = '1'

			if (moment(endDate as MomentInput) > moment(new Date())) {
				return errorResponse(res, 'Invalid End Date')
			}

			if (startDate && endDate) {
				startDate = moment(startDate as MomentInput)
					.subtract(1, 'day')
					.endOf('day')
					.format('YYYY-MM-DD HH:mm:ss')
				endDate = moment(endDate as MomentInput)
					.add(1, 'day')
					.endOf('day')
					.format('YYYY-MM-DD HH:mm:ss')
				query.dateTime = Between(startDate, endDate)
			}

			if (!currentUser?.admin) query.userId = currentUser?.id

			const [foods, pageCount] = await Food.findAndCount({
				where: query,
				take: PAGE_SIZE,
				skip: (+page! - 1) * PAGE_SIZE,
				order: { dateTime: 'DESC' },
				relations: ['user'],
			})

			const dailyCalorie = await getRepository(Food)
				.createQueryBuilder('foods')
				.select('SUM(foods.calorie)', 'sum')
				.addSelect('foods.date')
				.addSelect('foods.userId')
				.groupBy('foods.userId')
				.addGroupBy('foods.date')
				.having(startDate ? 'foods.datetime > :startDate' : '1=1', {
					startDate: `${startDate}`,
				})
				.andHaving(endDate ? 'foods.datetime < :endDate' : '1=1', {
					endDate: `${endDate}`,
				})
				.getRawMany()

			const responseCaloriesSum = dailyCalorie.map((calorie) => {
				return {
					[`${calorie.foods_date}-${calorie.foods_userId}`]: calorie.sum,
				}
			})
			const responseFoods = foods.map((food) => {
				const sum = responseCaloriesSum.find(
					(sum) => sum[`${food.date}-${food.userId}`]
				)
				const { user: _, ...foodsObj } = food
				return {
					...foodsObj,
					dailyCalorieSum: Object.values(sum)[0],
					dailyCalorieLimit: food.user.dailyCalorieLimit,
				}
			})

			return res.status(200).json({
				foods: responseFoods,
				page: page,
				pageCount: pageCount,
				pageSize: PAGE_SIZE,
			})
		} catch (error) {
			console.log('error :>> ', error)
			res.sendStatus(500)
		}
	}

	static async update(req: Request, res: Response) {
		const { id } = req.params
		const { error } = updateFoodSchema.validate(req.body)
		const { name, categoryId, calorie, dateTime } = req.body
		const date = moment(req.body.dateTime).format('YYYY-MM-DD')

		if (error) {
			return res.status(400).json(error.details)
		}

		if (date < moment(Date.now()).format('YYYY-MM-DD')) {
			return errorResponse(res, 'Invalid date')
		}

		try {
			const food = await Food.findOne(id)

			if (!food) {
				return errorResponse(res, 'Food not found', 404)
			}

			if (req.currentUser.id !== food.userId && !req.currentUser.admin) {
				return errorResponse(res, 'Permission Denied', 403)
			}

			const category = await Category.findOne(categoryId)

			if (!category) return errorResponse(res, 'Category not found', 404)

			const foodsCount = await Food.count({
				where: {
					categoryId,
					userId: food.userId ?? req.currentUser.id,
					date,
				},
			})

			const totalFoodCount =
				foodsCount - (food.categoryId === categoryId ? 1 : 0)

			if (totalFoodCount >= category.maxFoodItems) {
				return errorResponse(
					res,
					`${category.name.toUpperCase()} Max limit reached please select another category`
				)
			}

			food.categoryId = categoryId
			food.name = name
			food.date = date
			food.calorie = calorie
			food.dateTime = dateTime

			await Food.save(food!)

			return res.status(200).json(food)
		} catch (error) {
			console.log('error :>> ', error)
			return res.status(500).send(error)
		}
	}

	static async delete(req: Request, res: Response) {
		const { id } = req.params

		try {
			const food = await Food.findOne(id)

			if (!food) {
				return errorResponse(res, 'Food not found', 404)
			}

			if (food.userId !== req.currentUser.id && !req.currentUser.admin) {
				return errorResponse(res, 'Permision denied', 403)
			}

			await Food.remove(food!)

			return res.status(200).send('Succesfully Deleted')
		} catch (error) {
			return res.status(500).send(error)
		}
	}

	static async reports(req: Request, res: Response) {
		try {
			const today = new Date()
			const week = new Date()
			week.setDate(today.getDate() - 7)

			const reports: ReportT = {
				today: 0,
				lastWeek: 0,
				thisWeek: 0,
			}

			reports['today'] = await Food.count({
				where: {
					date: moment(today).format('YYYY-MM-DD'),
				},
			})

			reports['lastWeek'] = await Food.count({
				where: {
					date: LessThan(moment(week).format('YYYY-MM-DD')),
				},
			})

			reports['thisWeek'] = await Food.count({
				where: {
					date: Between(
						moment(week).format('YYYY-MM-DD'),
						moment(today).format('YYYY-MM-DD')
					),
				},
			})

			return res.status(200).json(reports)
		} catch (error) {
			return res.status(500).send(error)
		}
	}
}
