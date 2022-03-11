import {Box, Flex, Tooltip} from '@chakra-ui/react'
import React from 'react'
import {BiCategoryAlt, BiHomeAlt} from 'react-icons/bi'
import {IoStatsChart} from 'react-icons/io5'
import {MdOutlineFastfood} from 'react-icons/md'
import * as ROUTES from '../constants/routes'
import {useAppSelector} from '../redux/hooks'
import CustomLink from './UI/CustomLink'

const SideBar: React.FC = () => {
    const {user} = useAppSelector((state) => state.user)

    const toolTipProps = (label: string) => ({
        label,
        shouldWrapChildren: true,
        ml : "1rem",
        hasArrow:true,
        placement:'right' as const
    })

    return (
        <Flex
            paddingY={5}
            bg='white'
            as='nav'
            flexDirection={'column'}
            gap={5}
            alignItems='center'
            height={'100vh'}
            width={'80px'}>
            <Box as='div' color={'teal.400'} marginBottom={10} fontSize={'35px'}>
                <MdOutlineFastfood/>
            </Box>
            <CustomLink to={ROUTES.HOME}>
                <Tooltip {...toolTipProps('Home')}>
                    <BiHomeAlt/>
                </Tooltip>
            </CustomLink>
            <CustomLink to={ROUTES.CATEGORIES}>
                <Tooltip {...toolTipProps('Categories')}>
                    <BiCategoryAlt/>
                </Tooltip>
            </CustomLink>

            {user?.admin && (
                <CustomLink to={ROUTES.REPORTS}>
                    <Tooltip {...toolTipProps('Reports')}>
                    <IoStatsChart/>
                    </Tooltip>
                </CustomLink>
            )}
        </Flex>
    )
}

export default SideBar
