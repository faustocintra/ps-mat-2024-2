import {Router} from 'express'
import controller from '../controllers/cars.js'

const router = Router()

router.post('/', controller.create)

export default router
