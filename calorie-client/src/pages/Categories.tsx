import { Button, Flex, Heading, Skeleton } from '@chakra-ui/react'
import React, { useState } from 'react'
import CategoryItem from '../components/CategoryItem'
import { useAppSelector } from '../redux/hooks'

const Categories: React.FC = () => {
	const { categories } = useAppSelector((state) => state.categories)
	const { user } = useAppSelector((state) => state.user)
	const [isNew, setIsNew] = useState(false)

	return (
		<>
			<Flex flexDir={'column'} lineHeight={8} py={8}>
				<Flex mb={6} alignItems='center'>
					<Heading>Categories</Heading>
					{user?.admin && (
						<Button
							ml='auto'
							bg='teal.400'
							color='white'
							disabled={isNew}
							onClick={() => setIsNew(true)}>
							Add Category
						</Button>
					)}
				</Flex>

				<Flex gap={3} flexDir='column'>
					{isNew && (
						<CategoryItem
							isNew={isNew}
							category={{
								name: '',
								maxFoodItems: 5,
							}}
							setIsNew={(value) => setIsNew(value)}
						/>
					)}
					{categories?.length === 0 && !isNew ? (
						<Heading>Found 0 Categories, Click add to add category</Heading>
					) : !categories ? (
						<Skeleton height='150px' width='70%' marginX='auto' />
					) : (
						categories!.map((itm) => (
							<CategoryItem isNew={false} key={itm.id} category={itm} />
						))
					)}
				</Flex>
			</Flex>
		</>
	)
}

export default Categories
