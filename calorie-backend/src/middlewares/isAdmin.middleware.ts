import { NextFunction, Request, Response } from 'express'

const isAdminMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.currentUser

	if (!user?.admin) return res.status(403).send('Permission Denied')

	next()
}

export default isAdminMiddleware
