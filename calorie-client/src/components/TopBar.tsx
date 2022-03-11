import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import DatePicker from 'react-datepicker'
import { MdFilterListAlt } from 'react-icons/md'

interface TopBarProps {
	setAddNew: () => void
	setStartDate: (date: any) => void
	setEndDate: (date: any) => void
	reload: () => void
	setPage: (page: number) => void
	isAddNew: boolean
	startDate: any
	endDate: any
}

const TopBar: React.FC<TopBarProps> = ({
	setAddNew,
	isAddNew,
	setStartDate,
	setEndDate,
	startDate,
	endDate,
	setPage,
	reload,
}) => {
	const onChange = (dates: any) => {
		const [start, end] = dates
		setStartDate(start)
		setEndDate(end)
	}

	const handleFilter = () => {
		setPage(1)
		reload()
	}

	return (
		<Flex>
			<Flex bg='white' borderWidth={'thin'} alignItems='center' px={2}>
				<DatePicker
					placeholderText='StartDate - EndDate'
					className='date-range'
					selected={startDate}
					onChange={onChange}
					startDate={startDate}
					endDate={endDate}
					maxDate={new Date()}
					dateFormat='MMMM d, yyyy'
					selectsRange
				/>
				<MdFilterListAlt
					onClick={handleFilter}
					style={{
						color: 'teal',
						fontSize: '35px',
						cursor: 'pointer',
					}}
				/>
			</Flex>
			<Button
				ml='auto'
				size={'lg'}
				disabled={isAddNew}
				variant={'ghost'}
				bg='teal.400'
				color='white'
				_hover={{ bg: 'teal.600' }}
				onClick={() => setAddNew()}>
				Add Food
			</Button>
		</Flex>
	)
}

export default TopBar
