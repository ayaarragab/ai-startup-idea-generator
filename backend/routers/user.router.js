import Router from "express";
import { validateUpdateData } from "../middlewares/user.middlewares.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { updateUser } from "../controllers/user.controllers.js";

const router = Router();

router.patch("/:id", authenticate, validateUpdateData, updateUser);

export default router;
