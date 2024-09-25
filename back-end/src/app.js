import dotenv from 'dotenv'
dotenv.config()

import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'

const app = express()

import cors from 'cors'

app.use(cors({
    origin: process.env.FRONT_END_URL.split(','),
    // credentials: true
}))

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
//app.use('/users', usersRouter)

/* ******************** ROTAS DA API *********************** */

// Middleware de verificação de autorização
import authMiddleware from './middleware/auth.js'
app.use(authMiddleware)

import carsRouter from './routes/cars.js'
app.use('/cars', carsRouter)

import customersRouter from './routes/customers.js'
app.use('/customers', customersRouter)

import sellersRouter from './routes/sellers.js'
app.use('/sellers', sellersRouter)

import usersRouter from './routes/users.js'
app.use('/users', usersRouter)

export default app
