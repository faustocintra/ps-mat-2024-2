import dotenv from "dotenv"
dotenv.config()

import express, { json, urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'

import carsRouter from './routes/cars.js'
import customerRouter from './routes/customer.js'
import usersRouter from './routes/users.js'
// midlleware de verificação
import authMidlleware from './middleware/auth.js'

const app = express()

app.use(cors({
    origin: process.env.FRONT_END_URL.split(','),
    //credential: true
}))

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)


/************ ROTAS DA API ********************** */
//app.use (authMidlleware)
app.use('/cars', carsRouter)
app.use('/customers', customerRouter)
app.use('/users', usersRouter)

export default app
