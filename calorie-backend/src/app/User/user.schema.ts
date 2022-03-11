import Joi from 'joi'

export const createUserSchema = Joi.object({
	name: Joi.string().min(2).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(80).required(),
})

export const signinUserSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(80).required(),
})
