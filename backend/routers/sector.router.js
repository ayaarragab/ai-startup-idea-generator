import Router from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';
import { getSectors } from '../controllers/sector.controllers.js';

const router = Router();

router.get('/', authenticate, getSectors);

export default router;