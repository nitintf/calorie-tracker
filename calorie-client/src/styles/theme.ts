import { extendTheme, ThemeConfig } from '@chakra-ui/react'

import { fonts } from './fonts'

const config: ThemeConfig = {
	initialColorMode: 'light',
	useSystemColorMode: false,
}

const theme = extendTheme({ config, fonts })

export default theme
