import Router from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';
import { validateIdeaFields } from '../middlewares/idea.middlewares.js';
import { saveUserIdea } from '../controllers/idea.controllers.js';

const router = Router();

router.post('/saved-idea', authenticate, validateIdeaFields, saveUserIdea);