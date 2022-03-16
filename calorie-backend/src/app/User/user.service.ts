import { Request, Response } from 'express'
import { signJwt } from '../../helpers/jwt'
import logger from '../../helpers/logger'
import User from './user.entity'
import { createUserSchema, signinUserSchema } from './user.schema'
import bcrypt from 'bcrypt'
import { errorResponse } from '../../helpers/response'

export default class UserService {
	static async signup(req: Request, res: Response) {
		const { email, name, password } = req.body

		const { error } = createUserSchema.validate(req.body)

		if (error) {
			return res.json(error.details)
		}

		try {
			const userExists = await User.findOne({
				where: { email: email.toLowerCase() },
			})

			if (userExists) return errorResponse(res, 'Email already in use', 409)

			const user = User.create()

			user.email = email.toLowerCase()
			user.password = password
			user.name = name

			await User.save(user)

			const access_token = signJwt(
				{ userId: user.id.toString() },
				{
					expiresIn: '30d',
				}
			)

			return res.status(201).json({
				user,
				access_token,
			})
		} catch (error) {
			logger.error(error)
			return res.status(500).send(error)
		}
	}

	static async signin(req: Request, res: Response) {
		const { error } = signinUserSchema.validate(req.body)
		const errorMessage = 'Invalid credentials!'

		if (error) {
			return res.json(error.details)
		}

		const { email = '', password = '' } = req.body

		try {
			const user = await User.findOne({
				where: { email: email.toLowerCase() },
				select: ['email', 'name', 'password', 'id', 'admin'],
			})

			const isPasswordValid = await bcrypt.compare(
				password,
				user?.password ?? ''
			)

			if (!user || !isPasswordValid) {
				return errorResponse(res, errorMessage, 401)
			}

			const access_token = signJwt(
				{
					userId: user.id.toString(),
				},
				{
					expiresIn: '30d',
				}
			)

			const { password: pass, ...resUSer } = user
			return res.json({
				user: resUSer,
				access_token,
			})
		} catch (error) {
			logger.error(error)
			return res.status(500).send(error)
		}
	}

	static async currentUser(req: Request, res: Response) {
		const { currentUser } = req

		if (!currentUser) {
			return res.sendStatus(401)
		}

		return res.json(currentUser)
	}
}
