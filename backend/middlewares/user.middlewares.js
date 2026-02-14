import { findUserById } from '../services/auth.services.js';
import { compareTexts } from '../utils/hashing.utils.js';

export const validateUpdateData = (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName && !email) {
      return res.status(400).json({
        error: "INVALID_REQUEST",
        message: "Both fullname and email are empty"
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const fullNameRegex = /^[A-Za-z\s]{3,50}$/;

    if (!fullName || !fullNameRegex.test(fullName)) {
      return res.status(400).json({ error: "Invalid full name format" });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Update data isn't valid"
    });
  }
}

export const validateCurrentPassword = async (req, res, next) => {
  try {
    const { currentPassword } = req.body;
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'User not found' });
    }
    if (user.provider === 'google') {
      return next();
    }
    
    const isIdentical = await compareTexts(currentPassword, user.password);
    if (!isIdentical) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Password is not correct' });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR"
    });    
  }
}

export const validateNewPassword = (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "New password is empty" }); 
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ error: "Invalid password format" });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR"
    });
  }
}
