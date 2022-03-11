import {Button, Flex} from '@chakra-ui/react'
import React from 'react'

interface CardFooterProps {
    isEdit: boolean
    isNew: boolean
    onCancel: () => void
    onUpdate: () => void
    onDelete: () => void
    setIsEdit: () => void
}

const CardFooter: React.FC<CardFooterProps> = ({
                                                   isEdit,
                                                   isNew,
                                                   onCancel,
                                                   onDelete,
                                                   onUpdate,
                                                   setIsEdit,
                                               }) => {
    return (
        <Flex mt={6} alignSelf='flex-end' gap={5}>
            {isEdit ? (
                <>
                    <Button
                        _focus={{outline: 'none'}}
                        variant={'link'}
                        color='red.300'
                        onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        _focus={{outline: 'none'}}
                        variant={'link'}
                        color='teal.400'
                        onClick={onUpdate}>
                        {isNew ? 'Add' : 'Update'}
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        _focus={{outline: 'none'}}
                        variant={'link'}
                        color='red.300'
                        onClick={onDelete}>
                        Delete
                    </Button>
                    <Button
                        _focus={{outline: 'none'}}
                        variant={'link'}
                        color='teal.400'
                        onClick={setIsEdit}>
                        Edit
                    </Button>
                </>
            )}
        </Flex>
    )
}

export default CardFooter
