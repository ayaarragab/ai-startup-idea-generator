import Router from "express";
import { authenticate } from "../middlewares/auth.middlewares.js"
import { validatePrompt, validateMessageLength } from "../middlewares/chat.middlewares.js";
import { chatRateLimit } from "../middlewares/chatRateLimit.js";
// import { routeTimeout } from "../middlewares/routeTimeout.js";
import { handleAIChat, handleAIChatWithoutAuth } from "../controllers/chat.controllers.js";

const router = Router()

router.post('/', authenticate, chatRateLimit, validateMessageLength, validatePrompt, handleAIChat);

router.post('/without-auth', chatRateLimit, validateMessageLength, handleAIChatWithoutAuth)

export default router;