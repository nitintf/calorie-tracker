import { Flex, Heading, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Card from '../components/UI/Card'
import Spinner from '../components/UI/Spinner'
import { errorMessage } from '../helpers/errorMessage'
import { foodReportService } from '../services/foodService'
import { ReportT } from '../types'

const Reports: React.FC = () => {
	const [reports, setReports] = useState<ReportT | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const toast = useToast()

	useEffect(() => {
		const fetch = async () => {
			try {
				setIsLoading(true)
				const response = await foodReportService()
				setReports(response.data)
				setIsLoading(false)
			} catch (error: any) {
				toast({
					title: errorMessage(error),
					status: 'error',
				})
				setIsLoading(false)
				console.log(error)
				setError(error.message)
			}
		}

		fetch()
	}, [])

	return (
		<>
			<Heading mb={8}>Admin Report</Heading>
			<Flex gap={4} alignItems='center' flexWrap={'wrap'}>
				{isLoading ? (
					<>
						<Spinner />
					</>
				) : error ? (
					<>
						<>{error}</>
					</>
				) : (
					<>
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
					</>
				)}
			</Flex>
		</>
	)
}

export default Reports
