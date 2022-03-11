export interface UserT {
    id: number
    name: string
    email: string
    dailyCalorieLimit?: number
    admin: boolean
}

export interface FoodT {
    calorie: number
    dailyCalorieSum?: number
    dailyCalorieLimit?: number
    id?: number
    name: string
    category?: CategoryT
    dateTime: Date
    user?: UserT
    userId?: number
    categoryId?: number
}

export interface CategoryT {
    name: string
    id?: number
    maxFoodItems: number
}

export interface ReportT {
    today: number
    thisWeek: number
    lastWeek: number
}
