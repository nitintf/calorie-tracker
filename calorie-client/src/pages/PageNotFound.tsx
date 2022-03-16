import { Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import { useAppSelector } from '../redux/hooks'

interface NotFoundPageProps {
	isForbidden: boolean
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ isForbidden }) => {
	const { userError } = useAppSelector((state) => state.user)

	return (
		<Flex
			mt={5}
			gap={2}
			alignItems={'center'}
			justifyContent='center'
			flexDir={'column'}>
			{userError ? (
				<Heading>401 - Unauthorized</Heading>
			) : isForbidden ? (
				<Heading>403 - Forbidden</Heading>
			) : (
				<>
					<Heading>Page Not Found</Heading>
				</>
			)}
		</Flex>
	)
}

export default NotFoundPage
