import Router from "express";
import { authenticate } from "../middlewares/auth.middlewares.js"
import { validatePrompt, validateMessageLength } from "../middlewares/chat.middlewares.js";
import { chatRateLimit } from "../middlewares/chatRateLimit.js";
// import { routeTimeout } from "../middlewares/routeTimeout.js";
import { handleAIChat } from "../controllers/chat.controllers.js";

const router = Router()

router.post('/', authenticate, chatRateLimit, validateMessageLength, validatePrompt, handleAIChat);

export default router;