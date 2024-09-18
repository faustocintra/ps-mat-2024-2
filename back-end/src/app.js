import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import carsRouter from './routes/cars.js'
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import customerRouter from './routes/customers.js'

const app = express()
import cors from 'cors'
app.use(cors({
    origin: process.env.FRONT_END_URL.split(',',
        //credentials: true
    )
}))
import authMiddleware from './middleware/auth.js'

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
//app.use('/users', usersRouter)

app.use('/cars', carsRouter) 
app.use('/customers', customerRouter)
app.use('/users', usersRouter)

export default app
