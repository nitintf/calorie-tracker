import {Heading, Input} from '@chakra-ui/react'
import React from 'react'

interface EditableInputProps {
    isEdit: boolean
    value: string
    size: number
    setItem: (e: string) => void
    placeholder: string
}

const EditableInput: React.FC<EditableInputProps> = ({
                                                         isEdit,
                                                         setItem,
                                                         value,
                                                         size,
                                                         placeholder,
                                                     }) => {
    return (
        <>
            {isEdit ? (
                <Input
                    placeholder={placeholder}
                    value={value}
                    mb={1}
                    autoFocus={true}
                    fontSize={size + 'px'}
                    fontWeight={600}
                    onChange={(e) => setItem(e.target.value)}
                />
            ) : (
                <Heading isTruncated color={'teal.400'} fontSize={size + 'px'}>
                    {value}
                </Heading>
            )}
        </>
    )
}

export default EditableInput
