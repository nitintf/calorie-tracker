// @ts-nocheck
import API from './api'

export const fetchFoods = async ({ startDate, endDate, page }) => {
	const response = await API.get(
		`/foods?page=${page}${startDate ? `&startDate=${startDate}` : ''}${
			endDate ? `&endDate=${endDate}` : ''
		}`
	)

	return response
}

export const fetchCategoriesService = async () => {
	const response = await API.get(`/category`)

	return response
}

export const addCategoryService = async ({ name, maxFoodItems }: any) => {
	const response = await API.post('/category', { name, maxFoodItems })

	return response
}

export const updateCategoryService = async (
	{ name, maxFoodItems }: any,
	id: number
) => {
	const response = await API.put(`/category/${id}`, { name, maxFoodItems })

	return response
}

export const deleteCategoryService = async (id: number) => {
	const response = await API.delete(`/category/${id}`)

	return response
}

export const updateFoodService = async (id: number, body: any) => {
	const response = await API.put(`/foods/${id}`, body)

	return response
}

export const addFoodService = async (body: any) => {
	const response = await API.post('/foods', body)

	return response
}

export const deleteFoodService = async (id: number) => {
	const response = await API.delete(`/foods/${id}`)

	return response
}

export const foodReportService = async () => {
	const response = await API.get('/foods/reports')

	return response
}
