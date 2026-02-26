import Router from 'express';
import { authenticate } from '../middlewares/auth.middlewares.js';
import { validateIdeaFields } from '../middlewares/idea.middlewares.js';
import { saveUserIdea, unsaveUserIdea, getSavedIdeas } from '../controllers/idea.controllers.js';

const router = Router();

// save
router.post('/saved-ideas', authenticate, validateIdeaFields,saveUserIdea);

// unsave
router.delete('/saved-ideas/:id/:messageid', authenticate, unsaveUserIdea)

// get saved ideas

router.get('/saved-ideas', authenticate, getSavedIdeas);



export default router;