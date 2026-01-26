import Router from 'express';
import passport from "../auth/passport.auth.js";
import { validateCredentialsSignup, validateCredentialsLogin, validateOTPAndEmail, validateEmail, authenticate } from '../middlewares/auth.middlewares.js';
import { signup, login, verifyEmail, resendOTP, forgetPasswordOTP, verifyOTPForgetPassword, getCurrentUser, handleOAuthTokens } from '../auth/local.auth.js';
import dotenv from "dotenv";

const router = Router();
dotenv.config()

router.post('/signup', validateCredentialsSignup, signup);

router.post('/verify-email', validateOTPAndEmail, verifyEmail);

router.post('/resend-otp', validateEmail, resendOTP);

router.post('/forget-password', validateEmail, forgetPasswordOTP);

router.post('/verify-otp-forget-password', validateOTPAndEmail, verifyOTPForgetPassword);

router.post('/login', validateCredentialsLogin, login);

router.get('/me', authenticate, getCurrentUser)

router.get('/google', passport.authenticate("google", { scope: ['profile', 'email'] }))

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect(`http://localhost:${process.env.FRONTEND_PORT}/`);
    
    await handleOAuthTokens(req, res, user, info);
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect(`http://localhost:${process.env.FRONTEND_PORT}/`);
});

export default router;