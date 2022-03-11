import { Flex, Heading } from '@chakra-ui/react'
import React from 'react'
import { useAppSelector } from '../redux/hooks'

const NotFoundPage: React.FC = () => {
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
			) : (
				<>
					<Heading>Page Not Found</Heading>
				</>
			)}
		</Flex>
	)
}

export default NotFoundPage
