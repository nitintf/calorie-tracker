import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './styles/theme'
import { Provider } from 'react-redux'
import { store } from './redux/store'

import 'react-datepicker/dist/react-datepicker.css'
import './styles/date.css'

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ChakraProvider theme={theme} resetCSS>
				<App />
			</ChakraProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)
