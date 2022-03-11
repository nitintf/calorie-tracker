import React, {useState} from 'react'
import {CategoryT} from '../types'
import Card from './UI/Card'
import EditableInput from './UI/EditableInput'
import CardFooter from './UI/Card/CardFooter'
import EditableNumber from './UI/EditableNumber'
import {Flex, Text, useToast} from '@chakra-ui/react'
import {addCategoryService, deleteCategoryService, updateCategoryService,} from '../services/foodService'
import {useAppDispatch, useAppSelector} from '../redux/hooks'
import {addOneCategories, deleteCategories, updateCategories,} from '../redux/slices/category.slice'
import {errorMessage} from '../helpers/errorMessage'

interface CategoryItemT {
    category: CategoryT
    isNew: boolean
    setIsNew?: (value: boolean) => void
}

const CategoryItem: React.FC<CategoryItemT> = ({
                                                   category,
                                                   isNew,
                                                   setIsNew,
                                               }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [catg, setCatg] = useState(category)
    const {user} = useAppSelector((state) => state.user)
    const toast = useToast()
    const dispatch = useAppDispatch()

    const onCancel = () => {
        if (isNew) return setIsNew!(false)

        setCatg(category)
        setIsEdit(false)
    }

    const onUpdate = async () => {
        if (catg.name.trim().length < 3)
            return toast({
                title: 'Name should have atleast 3 char.',
                status: 'error',
            })

        if (catg.maxFoodItems < 1)
            return toast({
                title: 'Max food item value must be greater than 0',
                status: 'error',
            })

        try {
            if (isNew) {
                const response = await addCategoryService({
                    name: catg.name,
                    maxFoodItems: catg.maxFoodItems,
                })

                dispatch(addOneCategories(response.data))
                setIsNew!(false)
            } else {
                const response = await updateCategoryService(
                    {
                        name: catg.name,
                        maxFoodItems: catg.maxFoodItems,
                    },
                    catg.id!
                )
                dispatch(updateCategories(response.data))
                setIsEdit(false)
            }

            toast({
                title: 'Updated Succesfully',
                status: 'success',
            })
        } catch (error: any) {
            setIsEdit(false)
            toast({
                title: errorMessage(error),
                status: 'error',
            })
        }
    }
    const onDelete = async () => {
        try {
            const isConfirm = window.confirm('Dou want to delete this Category?')

            if (!isConfirm) return

            await deleteCategoryService(catg.id!)
            dispatch(deleteCategories(catg.id!))

            toast({
                title: 'Deleted Succesfully',
                status: 'success',
            })
        } catch (error: any) {
            toast({
                title: errorMessage(error),
                status: 'error',
            })
        }
    }

    return (
        <Card width='70%'>
            <EditableInput
                placeholder='Enter Category name'
                size={20}
                isEdit={isEdit || isNew}
                setItem={(e) => setCatg((prev) => ({...prev, name: e}))}
                value={catg.name}
            />
            <Flex gap={2}>
                <Text  fontWeight={'700'}>Max Food Items : </Text>
                <EditableNumber
                    placeholder='Enter max no. of food items'
                    value={category.maxFoodItems}
                    isEdit={isEdit || isNew}
                    setItem={(e) => setCatg((prev) => ({...prev, maxFoodItems: e}))}
                />
            </Flex>
            {user?.admin && (
                <CardFooter
                    isNew={isNew}
                    isEdit={isEdit || isNew}
                    onCancel={onCancel}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    setIsEdit={() => setIsEdit(true)}
                />
            )}
        </Card>
    )
}

export default CategoryItem
