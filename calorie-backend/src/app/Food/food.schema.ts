import Joi from 'joi'

const fields = {
	name: Joi.string().min(3).trim().required(),
	categoryId: Joi.optional(),
	dateTime: Joi.date().max('now').required(),
	calorie: Joi.number().min(50).max(4000).required(),
}

export const createFoodSchema = Joi.object({
	...fields,
	userId: Joi.number().min(1).optional(),
})

export const updateFoodSchema = Joi.object({
	...fields,
})

export const fetchAllFoodSchema = Joi.object({
	page: Joi.number().min(1),
	startDate: Joi.date().max('now').optional(),
	endDate: Joi.date().max('now').optional(),
})
