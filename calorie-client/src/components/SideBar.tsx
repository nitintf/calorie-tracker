import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import { BiCategoryAlt, BiHomeAlt } from 'react-icons/bi'
import { IoStatsChart } from 'react-icons/io5'
import { MdOutlineFastfood } from 'react-icons/md'
import * as ROUTES from '../constants/routes'
import { useAppSelector } from '../redux/hooks'
import CustomLink from './UI/CustomLink'

const SideBar: React.FC = () => {
	const { user } = useAppSelector((state) => state.user)

	return (
		<Flex
			paddingY={5}
			bg='white'
			as='nav'
			flexDirection={'column'}
			gap={5}
			alignItems='center'
			height={'100vh'}
			width={'80px'}>
			<Box as='div' color={'teal.400'} marginBottom={10} fontSize={'35px'}>
				<MdOutlineFastfood />
			</Box>
			<CustomLink to={ROUTES.HOME}>
				<BiHomeAlt />
			</CustomLink>
			<CustomLink to={ROUTES.CATEGORIES}>
				<BiCategoryAlt />
			</CustomLink>

			{user?.admin && (
				<CustomLink to={ROUTES.REPORTS}>
					<IoStatsChart />
				</CustomLink>
			)}
		</Flex>
	)
}

export default SideBar
