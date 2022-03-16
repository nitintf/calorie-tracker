import { useCallback, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './components/Auth'
import * as ROUTES from './constants/routes'
import Categories from './pages/Categories'
import Home from './pages/Home'
import Reports from './pages/Reports'
import { useAppDispatch } from './redux/hooks'
import { addCategories } from './redux/slices/category.slice'
import { updateUser, updateUserError } from './redux/slices/user.slice'
import { fetchCategoriesService } from './services/foodService'
import { currentUser } from './services/userService'
import NotFoundPage from './pages/PageNotFound'
import Wrapper from './components/UI/Wrapper'

function App() {
	const dispatch = useAppDispatch()

	const fetch = useCallback(async () => {
		try {
			const response = await currentUser()
			const catgResponse = await fetchCategoriesService()
			dispatch(updateUser(response))
			dispatch(addCategories(catgResponse.data))
		} catch (error) {
			dispatch(updateUserError(true))
		}
	}, [dispatch])

	useEffect(() => {
		fetch()
	}, [fetch])

	return (
		<BrowserRouter>
			<Wrapper>
				<Routes>
					<Route path={ROUTES.HOME} element={<Auth element={<Home />} />} />
					<Route
						path={ROUTES.CATEGORIES}
						element={<Auth element={<Categories />} />}
					/>
					<Route
						path={ROUTES.REPORTS}
						element={<Auth forAdmin={true} element={<Reports />} />}
					/>
					<Route path='/*' element={<NotFoundPage isForbidden={false} />} />
				</Routes>
			</Wrapper>
		</BrowserRouter>
	)
}

export default App
