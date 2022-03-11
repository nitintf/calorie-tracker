import {Flex, Heading} from '@chakra-ui/react'
import React, {useEffect, useState} from 'react'
import Card from '../components/UI/Card'
import Wrapper from '../components/UI/Wrapper'
import {foodReportService} from '../services/foodService'
import {ReportT} from '../types'

const Reports: React.FC = () => {
    const [reports, setReports] = useState<ReportT | null>(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await foodReportService()
                setReports(response.data)
            } catch (error) {
            }
        }

        fetch()
    }, [])

    return (
        <Wrapper>
            <Heading mb={8}>Admin Report</Heading>
            <Flex gap={4} alignItems='center' flexWrap={'wrap'}>
                <Card width='400px'>
                    <Heading color={'teal.400'} size='md' fontWeight={500}>
                        Today
                    </Heading>
                    <Heading mt={5} size='2xl'>
                        {reports?.today}
                    </Heading>
                </Card>
                <Card width='400px'>
                    <Heading color={'teal.400'} size='md' fontWeight={500}>
                        This Week
                    </Heading>
                    <Heading mt={5} size='2xl'>
                        {reports?.thisWeek}
                    </Heading>
                </Card>
                <Card width='400px'>
                    <Heading color={'teal.400'} size='md' fontWeight={500}>
                        Before 1 week
                    </Heading>
                    <Heading mt={5} size='2xl'>
                        {reports?.lastWeek}
                    </Heading>
                </Card>
            </Flex>
        </Wrapper>
    )
}

export default Reports
