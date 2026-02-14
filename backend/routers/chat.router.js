import Router from "express";
import { authenticate } from "../middlewares/auth.middlewares.js"
import { validatePrompt } from "../middlewares/chat.middlewares.js";
import { handleAIChat } from "../controllers/chat.controllers.js";

const router = Router()

router.post('/', /*authenticate,*/ validatePrompt, handleAIChat);

export default router;