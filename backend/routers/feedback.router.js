import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { sendFeedback } from "../controllers/feedback.controllers.js";

const router = Router();

router.post('/', authenticate, sendFeedback);

export default router;