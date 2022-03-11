import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserT } from '../../types'

type UserStateT = {
	user: UserT | null
	access_token: string | null
	userError?: boolean
}

const initialState: UserStateT = {
	user: null,
	access_token: null,
	userError: false,
}

const UserSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		updateUser: (state, action: PayloadAction<UserT | null>) => {
			state.user = action.payload
		},
		updateUserError: (state, action: PayloadAction<boolean>) => {
			state.userError = action.payload
		},
	},
})

export const { updateUser, updateUserError } = UserSlice.actions

export default UserSlice.reducer
