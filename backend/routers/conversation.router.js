import Router from "express";
import { authenticate } from "../middlewares/auth.middlewares.js"
import { getConversations } from "../controllers/conversation.controllers.js";

const router = Router();

router.get('/', authenticate, getConversations);

export default router;