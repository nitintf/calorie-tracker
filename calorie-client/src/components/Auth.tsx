import { Flex } from '@chakra-ui/react'
import * as React from 'react'
import { FC } from 'react'
import NotFoundPage from '../pages/PageNotFound'
import { useAppSelector } from '../redux/hooks'
import Spinner from './UI/Spinner'

interface IProps {
	forAdmin?: boolean
	element: JSX.Element
}

const Auth: FC<IProps> = ({ forAdmin = false, element }) => {
	const { user, userError } = useAppSelector((state) => state.user)

	if (!user && !userError)
		return (
			<>
				<Flex
					width='100vw'
					height='100vh'
					alignItems='center'
					justifyContent='center'>
					<Spinner />
				</Flex>
			</>
		)

	if (userError && !user) {
		return <NotFoundPage isForbidden={false} />
	}

	if (!forAdmin) {
		return element
	}

	if (forAdmin && user?.admin) {
		return element
	}

	return <NotFoundPage isForbidden={true} />
}

export default React.memo(Auth)
