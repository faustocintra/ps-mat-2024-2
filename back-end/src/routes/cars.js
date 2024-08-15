import { Router } from 'express'
import controller from '../controllers/cars.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)

export default router