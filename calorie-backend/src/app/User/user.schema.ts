import Joi from 'joi'

export const createUserSchema = Joi.object({
	name: Joi.string().min(2).trim().required(),
	email: Joi.string().email().trim().required(),
	password: Joi.string().min(6).trim().max(80).required(),
})

export const signinUserSchema = Joi.object({
	email: Joi.string().email().trim().required(),
	password: Joi.string().min(6).trim().max(80).required(),
})
