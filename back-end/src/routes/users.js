import e, { Router } from 'express';
import controller from '../controllers/users.js';

const router = Router();

router.post('/login', controller.login);
router.get('/me', controller.me)

router.post('/', controller.create);
router.get('/', controller.retriveAll);
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.post('/login', controller.login)

export default router;