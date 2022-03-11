import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {CategoryT} from '../../types'

type CategoryStateT = {
    categories: CategoryT[] | null
}

const initialState: CategoryStateT = {
    categories: null,
}

const CategorySlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        addCategories: (state, action: PayloadAction<CategoryT[]>) => {
            state.categories = action.payload
        },
        addOneCategories: (state, action: PayloadAction<CategoryT>) => {
            state.categories = [action.payload, ...state.categories!]
        },
        updateCategories: (state, action: PayloadAction<CategoryT>) => {
            state.categories = state.categories!.map((category) => {
                if (category.id === action.payload.id) {
                    return action.payload
                }
                return category
            })
        },
        deleteCategories: (state, action: PayloadAction<number>) => {
            state.categories = state.categories!.filter(
                (category) => category.id !== action.payload
            )
        },
    },
})

export const {
    addCategories,
    addOneCategories,
    deleteCategories,
    updateCategories,
} = CategorySlice.actions

export default CategorySlice.reducer
