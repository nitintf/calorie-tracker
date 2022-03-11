import { Response } from 'express'

export const errorResponse = (
	res: Response,
	message: string,
	httpCode = 400
) => {
	return res
		.json([
			{
				message,
			},
		])
		.status(httpCode)
}
