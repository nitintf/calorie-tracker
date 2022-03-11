import React from 'react'
import 'rc-pagination/assets/index.css'
import Paginate from 'rc-pagination'
import { VStack } from '@chakra-ui/react'

interface PaginationProps {
	currentPage: number
	pageCount: number
	setPage: (num: number) => void
	pageSize: number
}

const Pagination: React.FC<PaginationProps> = ({
	pageCount,
	currentPage,
	setPage,
	pageSize,
}) => {
	return (
		<VStack m={10}>
			<Paginate
				total={pageCount}
				current={currentPage}
				hideOnSinglePage
				onChange={(pgNum) => {
					setPage(pgNum)
				}}
				pageSize={pageSize}
			/>
		</VStack>
	)
}

export default Pagination
