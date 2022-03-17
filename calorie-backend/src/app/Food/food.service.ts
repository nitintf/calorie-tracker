import {Request, Response} from 'express'
import moment, {MomentInput} from 'moment'
import {Between, FindCondition, getRepository, LessThan} from 'typeorm'
import {PAGE_SIZE} from '../../constants'
import {errorResponse} from '../../helpers/response'
import Category from '../Category/category.entity'
import Food from './food.entity'
import {
    createFoodSchema,
    fetchAllFoodSchema,
    updateFoodSchema,
} from './food.schema'
import User from '../User/user.entity'

export default class FoodService {
    static async create(req: Request, res: Response) {
        const {name, categoryId, calorie, dateTime, userId} = req.body
        const {error} = createFoodSchema.validate(req.body)
        const date = moment(req.body.dateTime).format('YYYY-MM-DD')

        if (error) {
            return res.status(400).send(error.details)
        }

        try {
            const category = await Category.findOne({where: {id: categoryId}})

            if (categoryId && !category) return errorResponse(res, 'Category not found', 404)

            const user = await User.findOne({where: {id: userId}})
            if (userId && !user) return errorResponse(res, 'User not found', 404)


            const foodsCount = await Food.count({
                where: {
                    categoryId,
                    userId: (req.currentUser.admin && userId) ? userId : req.currentUser.id,
                    date,
                },
            })

            if (category && foodsCount >= category.maxFoodItems) {
                return errorResponse(
                    res,
                    `${category.name.toUpperCase()} Max limit of ${category.maxFoodItems} reached please select another category`
                )
            }

            const food = Food.create()
            food.calorie = calorie
            food.name = name
            food.dateTime = dateTime
            food.categoryId = categoryId
            food.userId = (req.currentUser.admin && userId) ? userId : req.currentUser.id
            food.date = date
            await Food.save(food)
            return res.status(201).json(food)
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    static async fetchAll(req: Request, res: Response) {
        try {
            const {currentUser} = req
            let {page = 1, startDate, endDate} = req.query

            const {error} = fetchAllFoodSchema.validate({
                page,
                startDate,
                endDate,
            })

            if (error) {
                return res.status(400).send(error.details)
            }

            const query: FindCondition<Food> = {}

            if ((startDate && !endDate) || (endDate && !startDate))
                return errorResponse(res, 'Both start date and end date is required')

            if (startDate && endDate) {
                if (startDate > endDate) return errorResponse(res, `Start date can't be greater than end date`)

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

            if (!currentUser.admin) query.userId = currentUser.id

            const [foods, pageCount] = await Food.findAndCount({
                where: query,
                take: PAGE_SIZE,
                skip: (+page! - 1) * PAGE_SIZE,
                order: {dateTime: 'DESC'},
                relations: ['user'],
            })

            const dailyCalorie = await getRepository(Food)
                .createQueryBuilder('foods')
                .select('SUM(foods.calorie)', 'sum')
                .addSelect('foods.date')
                .addSelect('foods.userId')
                .groupBy('foods.userId')
                .addGroupBy('foods.date')
                .getRawMany()

            const responseCaloriesSum = dailyCalorie.reduce((total,calorie) => {
                const key = `${calorie.foods_date}:${calorie.foods_userId}`;
                total[key] = calorie.sum
                return total;
            }, {})
            const responseFoods = foods.map((food) => {
                const dailyCalorieSum = responseCaloriesSum[`${food.date}:${food.userId}`]
                return {
                    ...food,
                    user:undefined,
                    dailyCalorieSum,
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
        const {id} = req.params
        const {error} = updateFoodSchema.validate(req.body)
        const {name, categoryId, calorie, dateTime} = req.body
        const date = moment(req.body.dateTime).format('YYYY-MM-DD')

        if (error) {
            return res.status(400).json(error.details)
        }


        try {
            const food = await Food.findOne(id)

            if (!food) {
                return errorResponse(res, 'Food not found', 404)
            }

            if (req.currentUser.id !== food.userId && !req.currentUser.admin) {
                return errorResponse(res, 'Permission Denied', 403)
            }

            const category = await Category.findOne({where:{id: categoryId}})

            if (categoryId && !category) return errorResponse(res, 'Category not found', 404)

            const foodsCount = await Food.count({
                where: {
                    categoryId,
                    userId: food.userId,
                    date,
                },
            })

            const totalFoodCount =
                foodsCount - ((food.categoryId === categoryId && food.date === date) ? 1 : 0)

            if (category && totalFoodCount >= category.maxFoodItems) {
                return errorResponse(
                    res,
                    `${category.name.toUpperCase()} Max limit of ${category.maxFoodItems} reached please select another category`
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
        const {id} = req.params

        try {
            const food = await Food.findOne({where: {id}})

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

            const reports: any = {
                today: 0,
                lastWeek: 0,
                thisWeek: 0,
                avgCalorie: 0
            }

            reports['today'] = await Food.count({
                where: {
                    date: moment(today).format('YYYY-MM-DD'),
                },
            })

            reports['lastWeek']= await Food.count({
                where: {
                    date: LessThan(moment(week).format('YYYY-MM-DD')),
                },
            })

            const foodThisWeek = await Food.find({
                where: {
                    date: Between(
                        moment(week).format('YYYY-MM-DD'),
                        moment(today).format('YYYY-MM-DD')
                    ),
                },
            })
            let totalCal = 0
            const len = foodThisWeek.length;
            for (let i = 0; i < len; i++) {
                totalCal += foodThisWeek[i].calorie;
            }
            reports['thisWeek'] = foodThisWeek.length

            reports['avgCalorie'] = +(totalCal / len).toFixed(2);

            return res.status(200).json(reports)
        } catch (error) {
            return res.status(500).send(error)
        }
    }
}
