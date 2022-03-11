import { NextFunction, Request, Response } from 'express'
import User from '../app/User/user.entity'
import { verifyJwt } from '../helpers/jwt'

declare global {
	namespace Express {
		interface Request {
			currentUser?: User
		}
	}
}

const currentUserMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization

	if (token) {
		try {
			const userId = verifyJwt(token)
			const user = await User.findOne(parseInt(userId))

			if (!user) {
				return res.status(401).send('Unauthorized')
			}

			req.currentUser = user
			next()
		} catch (err) {
			return res.sendStatus(401)
		}
	}

	return res.status(401)
}

export default currentUserMiddleware
