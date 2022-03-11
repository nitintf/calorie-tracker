import Joi from 'joi'

export const createCategorySchema = Joi.object({
	name: Joi.string().min(3).required(),
	maxFoodItems: Joi.number().min(0).required(),
})

export const updateCategorySchema = Joi.object({
	name: Joi.string().min(3),
	maxFoodItems: Joi.number().min(0),
	id: Joi.number().required(),
})
