import {Flex, Heading, Text} from '@chakra-ui/react'
import React from 'react'
import {Link} from 'react-router-dom'
import {HOME} from '../constants/routes'
import {useAppSelector} from '../redux/hooks'

const NotFoundPage: React.FC = () => {
    const {userError} = useAppSelector((state) => state.user)

    return (
        <Flex
            mt={5}
            gap={2}
            alignItems={'center'}
            justifyContent='center'
            flexDir={'column'}>
            <Heading>Something went wrong</Heading>
            {userError ? <Heading>401 - Unauthorized</Heading> : <>
                <Text>
                    take me back to{' '}
                    <Link to={HOME}>
                        {'  '}
                        <strong style={{textDecoration: 'underline'}}>Home</strong>
                    </Link>
                </Text>
            </>}

        </Flex>
    )
}

export default NotFoundPage
