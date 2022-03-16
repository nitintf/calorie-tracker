export const errorMessage = (error: any) => {
	return (
		error.response?.data[0]?.message ??
		error?.message ??
		'Something went wrong, please try again'
	)
}
