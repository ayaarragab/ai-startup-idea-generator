import Router from 'express';
import { authenticate } from "../middlewares/auth.middlewares.js"
import { validateIdeaInputs } from '../middlewares/idea.middlewares.js';
import { generateNewIdea } from '../controllers/idea.controller.js';

const router = Router();

router.post('/generate', authenticate, validateIdeaInputs, generateNewIdea);