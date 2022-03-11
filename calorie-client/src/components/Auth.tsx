import { Flex } from '@chakra-ui/react'
import * as React from 'react'
import { FC } from 'react'
import { Navigate } from 'react-router-dom'
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
		return <Navigate to='/404' replace={true} />
	}

	if (!forAdmin) {
		return element
	}

	if (forAdmin && user?.admin) {
		return element
	}

	return <Navigate to='/' replace={true} />
}

export default React.memo(Auth)
