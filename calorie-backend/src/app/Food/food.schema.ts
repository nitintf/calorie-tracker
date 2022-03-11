import Joi from 'joi'

export const createFoodSchema = Joi.object({
	name: Joi.string().min(3).required(),
	categoryId: Joi.optional(),
	dateTime: Joi.date().required(),
	calorie: Joi.number().min(1).required(),
})

export const updateFoodSchema = Joi.object({
	name: Joi.string().min(3),
	categoryId: Joi.optional(),
	dateTime: Joi.date(),
	calorie: Joi.number().min(1),
})
