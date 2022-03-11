import {
	Button,
	Flex,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	Tooltip,
	useToast,
} from '@chakra-ui/react'
import moment from 'moment'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { MdError } from 'react-icons/md'
import { errorMessage } from '../helpers/errorMessage'
import { useAppSelector } from '../redux/hooks'
import {
	addFoodService,
	deleteFoodService,
	updateFoodService,
} from '../services/foodService'
import { FoodT } from '../types'
import Card from './UI/Card'
import CardFooter from './UI/Card/CardFooter'
import EditableInput from './UI/EditableInput'
import EditableNumber from './UI/EditableNumber'

interface FoodCardProps {
	food: FoodT
	isNew: boolean
	reloadList: () => void
	setIsAddNew: (value: boolean) => void
}

const FoodCard: React.FC<FoodCardProps> = ({
	food,
	isNew,
	reloadList,
	setIsAddNew,
}) => {
	const [foodItem, setFoodItem] = useState(food)
	const [isEdit, setIsEdit] = useState<boolean>(false)
	const toast = useToast()
	const { user } = useAppSelector((state) => state.user)

	const { categories } = useAppSelector((state) => state.categories)

	const onCancel = () => {
		if (isNew) {
			setIsAddNew!(false)
			return
		}
		setFoodItem(food)
		setIsEdit(false)
	}

	const onUpdate = async () => {
		const { calorie, name } = foodItem

		if (name.trim().length < 3)
			return toast({
				title: 'Name should have atleast 3 char.',
				status: 'error',
			})

		if (calorie < 1)
			return toast({
				title: 'Calorie must be greater than 0',
				status: 'error',
			})

		const body = {
			name: foodItem.name,
			calorie: foodItem.calorie,
			dateTime: foodItem.dateTime,
			categoryId: foodItem.categoryId,
		}

		try {
			if (isNew) {
				await addFoodService(body)
			} else {
				await updateFoodService(foodItem.id!, body)
			}
			toast({
				status: 'success',
				title: 'Updated Successfully',
			})
			reloadList()
			setIsEdit(false)
			setIsAddNew(false)
		} catch (error: any) {
			toast({
				title: errorMessage(error),
				status: 'error',
			})
		}
	}

	const onDelete = async () => {
		try {
			const isConfirm = window.confirm('Dou want to delete this food?')

			if (!isConfirm) return

			await deleteFoodService(foodItem.id!)
			toast({
				status: 'success',
				title: 'Deleted Successfully',
			})

			reloadList()
			setIsEdit(false)
		} catch (error: any) {
			toast({
				title: errorMessage(error),
				status: 'error',
			})
		}
	}

	return (
		<Card width='70%'>
			<Flex>
				<Flex flexDirection={'column'} maxW='60%' lineHeight={10}>
					<EditableInput
						size={30}
						placeholder='Enter Food name'
						isEdit={isEdit || isNew}
						setItem={(e) => setFoodItem((prev) => ({ ...prev, name: e }))}
						value={foodItem.name}
					/>
					<Flex alignItems={'center'} gap={1}>
						<Text as='p'>Calories :</Text>
						<EditableNumber
							placeholder='Calories'
							value={foodItem.calorie}
							max={food?.dailyCalorieLimit}
							isEdit={isEdit || isNew}
							setItem={(e) => setFoodItem((prev) => ({ ...prev, calorie: e }))}
						/>
						{foodItem.dailyCalorieSum! > food.dailyCalorieLimit! && (
							<Tooltip
								label='Daily calorie limit reached'
								shouldWrapChildren
								hasArrow>
								<MdError color='rgb(143, 16, 16)' />
							</Tooltip>
						)}
					</Flex>
					{user?.admin && (
						<Flex alignItems={'center'} gap={1}>
							<Text>User ID :</Text>
							<Text>{foodItem.userId}</Text>
						</Flex>
					)}
				</Flex>

				<Flex gap={3} ml='auto' flexDir={'column'} alignItems='flex-end'>
					<Menu>
						<MenuButton width='150px' disabled={!isEdit && !isNew} as={Button}>
							{foodItem.categoryId
								? categories?.find((itm) => itm.id === foodItem.categoryId)
										?.name
								: 'No Category'}
						</MenuButton>
						<MenuList maxH={'300px'} overflow={'auto'}>
							{categories?.length! === 0 || null ? (
								<MenuItem disabled={true}>
									Please first create a category
								</MenuItem>
							) : (
								<>
									<MenuItem
										onClick={(e) =>
											setFoodItem((prev) => ({
												...prev,
												categoryId: undefined,
											}))
										}>
										None
									</MenuItem>
									{categories?.map((itm) => (
										<MenuItem
											key={itm.id}
											onClick={(e) =>
												setFoodItem((prev) => ({ ...prev, categoryId: itm.id }))
											}>
											{itm.name}
										</MenuItem>
									))}
								</>
							)}
						</MenuList>
					</Menu>

					<DatePicker
						onChangeRaw={(e) => e.preventDefault()}
						placeholderText='Enter Date-Time'
						autoComplete='off'
						className='date-picker'
						showTimeSelect
						dateFormat='MMM d, yyyy h:mm aa'
						selected={
							food.dateTime ? moment(foodItem.dateTime).toDate() : undefined
						}
						onChange={(value) => {
							setFoodItem((prev) => ({ ...prev, dateTime: value! }))
						}}
						disabled={!isEdit && !isNew}
						maxDate={new Date()}
						showMonthDropdown
						showYearDropdown
						dropdownMode='select'
						required
					/>
				</Flex>
			</Flex>
			<CardFooter
				isNew={isNew}
				isEdit={isEdit || isNew}
				onCancel={onCancel}
				onDelete={onDelete}
				onUpdate={onUpdate}
				setIsEdit={() => setIsEdit(true)}
			/>
		</Card>
	)
}

export default FoodCard
