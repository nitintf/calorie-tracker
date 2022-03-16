import Joi from 'joi'

export const categorySchema = Joi.object({
	name: Joi.string().min(3).trim().required(),
	maxFoodItems: Joi.number().min(1).max(10).required(),
})
