import Router from "express";
import { authenticate } from "../middlewares/auth.middlewares.js"
import { validatePrompt } from "../middlewares/chat.middlewares.js";

const router = Router()

router.post('/message', authenticate, validatePrompt)

export default router;