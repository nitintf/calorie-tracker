import { Container, Flex } from '@chakra-ui/react'
import React from 'react'
import SideBar from '../SideBar'

const Wrapper: React.FC = ({ children }) => {
	return (
		<Flex as='main' width='100vw' height='100vh' bg='gray.100'>
			<SideBar />

			<Container
				maxW={'container.xl'}
				pt={6}
				minH='fit-content'
				overflow='auto'
				css={{
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				}}>
				{children}
			</Container>
		</Flex>
	)
}

export default Wrapper
