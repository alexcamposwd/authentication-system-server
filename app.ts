import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import { mongooseConnection } from './config/mongooseConnection.config'
import index from './routes'
import auth from './routes/auth_router'
import userRoutes from './routes/user_router'

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.json({ type: 'application/vnd.api+json' }))
app.use(cors())
app.use(morgan('dev'))

app.set('mongoose connection', mongooseConnection)

app.use(index)
app.use('/api/v1', auth)
app.use('/api/v1', userRoutes)

export default app
