import Router from "express";
import { authenticate } from "../middlewares/auth.middlewares.js"
import { getConversations, getConversation, createOneConversation } from "../controllers/conversation.controllers.js";

const router = Router();

router.get('/', authenticate, getConversations);

router.get('/:id', authenticate, getConversation);

router.post('/', authenticate, createOneConversation)

export default router;