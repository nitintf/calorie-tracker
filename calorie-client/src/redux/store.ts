import { configureStore } from '@reduxjs/toolkit'
import UserSlice from './slices/user.slice'
import CategorySlice from './slices/category.slice'

export const store = configureStore({
	reducer: {
		user: UserSlice,
		categories: CategorySlice,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
