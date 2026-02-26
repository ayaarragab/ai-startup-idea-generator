import Router from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';
import { validateIdeaFields } from '../middlewares/idea.middlewares.js';
import { saveUserIdea, unsaveUserIdea } from '../controllers/idea.controllers.js';

const router = Router();

router.post('/saved-ideas', authenticate, validateIdeaFields,saveUserIdea);

router.delete('/saved-ideas/:id/:messageid', authenticate, unsaveUserIdea)

export default router;