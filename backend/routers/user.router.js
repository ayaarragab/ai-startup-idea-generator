import Router from 'express';
import { validateUpdateData } from '../middlewares/user.middlewares';
import { authenticate } from 'passport';
import { updateUser } from '../controllers/user.controllers';

const router = Router();

router.patch("/:id", authenticate, validateUpdateData, updateUser);

dotenv.config()

export default router;