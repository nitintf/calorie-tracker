import React from 'react'
import {Flex} from '@chakra-ui/react'

interface CardProps {
    width: string
}

const Card: React.FC<CardProps> = ({children, width}) => {
    return (
        <Flex
            borderWidth={'thin'}
            bg='whiteAlpha.800'
            width={width}
            flexDir={'column'}
            fontWeight={600}
            marginX={'auto'}
            borderRadius={7}
            _hover={{
                boxShadow: 'base',
            }}
            p={4}>
            {children}
        </Flex>
    )
}

export default Card
