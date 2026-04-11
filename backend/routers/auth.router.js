import Router from "express";
import passport from "../auth/passport.auth.js";
import {
  validateCredentialsSignup,
  validateCredentialsLogin,
  validateOTPAndEmail,
  validateEmail,
  validateResetPassword,
  authenticate,
} from "../middlewares/auth.middlewares.js";
import {
  signup,
  login,
  generateNewAccessToken,
  verifyEmail,
  resendOTP,
  forgetPasswordOTP,
  resetPassword,
  verifyOTPForgetPassword,
  getCurrentUser,
  handleOAuthTokens,
} from "../controllers/auth.controllers.js";
import dotenv from "dotenv";

const router = Router();
dotenv.config();

router.post("/signup", validateCredentialsSignup, signup);

router.post("/verify-email", validateOTPAndEmail, verifyEmail);

router.post("/resend-otp", validateEmail, resendOTP);

router.post("/forget-password", validateEmail, forgetPasswordOTP);

router.post(
  "/verify-otp-forget-password",
  validateOTPAndEmail,
  verifyOTPForgetPassword,
);

router.post(
  "/reset-password",
  validateEmail,
  validateResetPassword,
  resetPassword,
);

router.post("/login", validateCredentialsLogin, login);

router.get("/me", authenticate, getCurrentUser);

router.post("/refresh-token", generateNewAccessToken);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", async (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.redirect(`https://ai-startup-idea-generator.netlify.app/`);

    await handleOAuthTokens(req, res, user, info);
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect(`https://ai-startup-idea-generator.netlify.app/`);
});

export default router;
