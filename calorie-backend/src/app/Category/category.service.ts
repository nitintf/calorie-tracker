import { Request, Response } from 'express'
import { errorResponse } from '../../helpers/response'
import Category from './category.entity'
import { categorySchema } from './category.schema'

export default class CategoryService {
	static async create(req: Request, res: Response) {
		const { name, maxFoodItems } = req.body
		const { error } = categorySchema.validate(req.body)
		if (error) {
			return res.status(400).send(error.details)
		}

		try {
			const categoryExists = await Category.findOne({
				where: { name: req.body.name },
			})

			if (categoryExists) {
				return errorResponse(res, 'Category already exists')
			}

			const category = Category.create()
			category.name = name
			category.maxFoodItems = maxFoodItems

			await Category.save(category)

			return res.status(201).json(category)
		} catch (error) {
			return res.status(500).send(error)
		}
	}

	static async fetchAll(req: Request, res: Response) {
		try {
			const categories = await Category.find({ order: { createdAt: 'DESC' } })
			return res.status(200).json(categories)
		} catch (error) {
			return errorResponse(res, 'S0mething went wrong, please try again', 500)
		}
	}

	static async update(req: Request, res: Response) {
		const { id } = req.params

		const { name, maxFoodItems } = req.body
		const { error } = categorySchema.validate({ name, maxFoodItems })

		if (error) {
			return res.status(400).send(error.details)
		}

		try {
			const categoryExists = await Category.findOne({
				where: { name, id: !id },
			})

			if (categoryExists) return errorResponse(res, 'Category already exists')

			const category = await Category.findOne(id)

			if (!category) {
				return errorResponse(res, 'Category not found', 404)
			}

			Object.assign(category!, req.body)

			Category.save(category!)

			return res.status(200).json(category)
		} catch (error) {
			return res.status(500).send(error)
		}
	}

	static async delete(req: Request, res: Response) {
		const { id } = req.params

		try {
			const category = await Category.findOne(id)

			if (!category) {
				return errorResponse(res, 'Category not found', 404)
			}

			Category.remove(category!)

			return res.status(200).send('Succesfully Deleted')
		} catch (error) {
			return res.status(500).send(error)
		}
	}
}
