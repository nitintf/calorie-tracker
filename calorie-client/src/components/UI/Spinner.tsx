import {Flex, Spinner as Loader} from '@chakra-ui/react'
import React from 'react'

const Spinner = () => {
    return (
        <Flex
            width='100%'
            height='80%'
            alignItems={'center'}
            justifyContent='center'>
            <Loader color='teal.300' size='xl'/>
        </Flex>
    )
}

export default Spinner
