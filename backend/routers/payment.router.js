import Router from "express";
import { createIdeaPayment, transactionCallback } from "../controllers/payment.controller.js";
import { authenticate } from "../middlewares/auth.middlewares.js"

const router = Router();

router.post("/buy-idea", authenticate, createIdeaPayment);
router.post('/callback', transactionCallback);

export default router;