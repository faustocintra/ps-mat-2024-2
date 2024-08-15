import {Router} from 'express'
import controller from '../controllers/cars.js'

const router = Router()
router.post('/', controller.create)
router.get('/', controller.retrievall)
export default router