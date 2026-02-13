import Router from "express";
import { validateUpdateData, validateNewPassword, validateCurrentPassword } from "../middlewares/user.middlewares.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { updateUser, updateUserPassword } from "../controllers/user.controllers.js";

const router = Router();

router.patch("/:id", authenticate, validateUpdateData, updateUser);

router.patch("/password/:id", authenticate, validateCurrentPassword, validateNewPassword, updateUserPassword)

export default router;
