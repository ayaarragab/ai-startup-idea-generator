import Router from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';
import { getSectors } from '../controllers/sectors.controllers';

const router = Router();

router.get('/', authenticate, getSectors);