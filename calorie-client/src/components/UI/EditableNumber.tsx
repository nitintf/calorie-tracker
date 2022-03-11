import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
} from '@chakra-ui/react'
import React from 'react'

interface EditableNumberProps {
    isEdit: boolean
    value: number
    max?: number
    setItem: (e: number) => void
    placeholder: string
}

const EditableNumber: React.FC<EditableNumberProps> = ({
                                                           isEdit,
                                                           setItem,
                                                           value,
                                                           max,
                                                           placeholder,
                                                       }) => {
    return (
        <>
            {isEdit ? (
                <NumberInput
                    placeholder={placeholder}
                    defaultValue={isNaN(value) ? 0 : value}
                    onChange={(e) => setItem(parseInt(e))}
                    max={max}
                    clampValueOnBlur={false}>
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
            ) : (
                <Text>{value}</Text>
            )}
        </>
    )
}

export default EditableNumber
