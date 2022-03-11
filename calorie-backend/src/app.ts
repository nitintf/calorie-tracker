import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'

import logger from './helpers/logger'
import routes from './routes'
import connectDb from './db/connect'
import User from './app/User/user.entity'

dotenv.config()

// init app
const app = express()

// init middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

// routes
app.use(routes)

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
	logger.info(`App running at http://localhost:${PORT}`)
	await connectDb()
})
