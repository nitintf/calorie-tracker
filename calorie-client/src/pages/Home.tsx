import { Flex, Heading, Spinner, useToast } from '@chakra-ui/react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import FoodCard from '../components/FoodCard'
import TopBar from '../components/TopBar'
import Pagination from '../components/UI/Pagination'
import Wrapper from '../components/UI/Wrapper'
import { errorMessage } from '../helpers/errorMessage'
import { useAppSelector } from '../redux/hooks'
import { fetchFoods } from '../services/foodService'
import { FoodT } from '../types'

const Home: React.FC = () => {
	const [foodList, setFoodList] = useState<FoodT[] | undefined>(undefined)
	const [isAddNew, setIsAddNew] = useState(false)
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)
	const [page, setPage] = useState(1)
	const [pageInfo, setPageInfo] = useState({
		pageSize: 0,
		pageCount: 0,
	})
	const [reload, setReload] = useState(false)
	const { user } = useAppSelector((state) => state.user)

	const toast = useToast()

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await fetchFoods({
					startDate: startDate
						? moment(startDate).format('YYYY-MM-DD[T]hh:mm:ss')
						: null,
					endDate: endDate
						? moment(endDate).format('YYYY-MM-DD[T]hh:mm:ss')
						: null,
					page: page,
				})

				if (response.data.foods.length === 0) {
					setPage((page) => {
						if (page === 1) return 1
						return page - 1
					})
				}

				setFoodList(response.data.foods)
				setPageInfo({
					pageCount: response.data.pageCount,
					pageSize: response.data.pageSize,
				})
			} catch (error: any) {
				toast({
					title: errorMessage(error),
					status: 'error',
				})
			}
		}

		fetch()
	}, [page, reload])

	const reloadList = () => {
		setReload((prev) => !prev)
	}

	return (
		<Wrapper>
			<Flex gap={8} flexDirection='column' mb={6}>
				<TopBar
					setStartDate={(date) => setStartDate(date)}
					setEndDate={(date) => setEndDate(date)}
					setAddNew={() => setIsAddNew(true)}
					isAddNew={isAddNew}
					startDate={startDate}
					endDate={endDate}
					reload={reloadList}
					setPage={(num) => setPage(num)}
				/>
				{isAddNew && (
					<FoodCard
						reloadList={reloadList}
						setIsAddNew={(value) => setIsAddNew(value)}
						isNew={isAddNew}
						food={{
							calorie: 0,
							dateTime: new Date(),
							name: '',
							userId: user?.id,
						}}
					/>
				)}
				{foodList?.length === 0 ? (
					<Heading textAlign={'center'}>No Food Items</Heading>
				) : !foodList ? (
					<>
						<Spinner m={'auto'} color='teal.400' size={'lg'} />
					</>
				) : (
					foodList.map((foodItm) => {
						return (
							<FoodCard
								reloadList={reloadList}
								key={`${foodItm.id}-${foodItm.calorie}-${foodItm.dailyCalorieSum}`}
								isNew={false}
								food={foodItm}
								setIsAddNew={(value) => setIsAddNew(value)}
							/>
						)
					})
				)}
			</Flex>
			<Pagination
				currentPage={page}
				pageCount={pageInfo.pageCount}
				setPage={(num) => setPage(num)}
				pageSize={pageInfo.pageSize}
			/>
		</Wrapper>
	)
}

export default Home
