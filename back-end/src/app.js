import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'
dotenv.config() //Carrega as variáveis de ambiente do arquivo .env

import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import carsRouter from './routes/cars.js'
import customersRouter from './routes/customers.js'
import sellersRouter from './routes/sellers.js'
import authMiddleware from './middleware/auth.js'
import cors from 'cors'
const app = express()

app.use(cors({
    origin: process.env.FRONT_END_URL.split(","),
    //credentials: true
}))
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)

app.use(authMiddleware)
app.use('/users', usersRouter)
app.use('/cars', carsRouter)
app.use('/customers', customersRouter)
app.use('/sellers', sellersRouter)

export default app
