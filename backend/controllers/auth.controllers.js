import {
  findUser,
  findUserById,
  handleExistingUser,
  handleNewUser,
  handleOAuthSignup,
} from "../services/auth.services.js";
import { sendVerificationEmail, generateOTP } from "../utils/email.utils.js";
import { compareTexts, hashText } from "../utils/hashing.utils.js";
import {
  validateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.utils.js";
import dotenv from "dotenv";
import db from "../models/index.js";

const { User } = db;
dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;

    return await handleExistingUser(user, password, res);
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await findUser(email);

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    return await handleNewUser(fullName, email, password, res);
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleOAuthTokens = (req, res, user, info) => {
  req.user = user;

  const { accessToken, refreshToken } = handleOAuthSignup({
    email: user.email,
    username: user.username,
    id: user.id,
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "None",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  if (info === "registered") {
    return res.redirect(`https://ai-startup-idea-generator.netlify.app/login`);
  } else if (info === "loggedin") {
    return res.redirect(
      `https://ai-startup-idea-generator.netlify.app/auth/callback`,
    );
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }
    const compareOTPs = await compareTexts(otp, user.otp);
    if (!compareOTPs) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    user.isVerified = true;
    user.emailOTP = null; // Clear the OTP after successful verification
    await User.update(
      {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
      {
        where: { email },
      },
    );

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    const otp = generateOTP();
    const hashedOTP = await hashText(otp);

    // Update user with new OTP and expiry
    await User.update(
      { otp: hashedOTP, otpExpires: Date.now() + 10 * 60 * 1000 },
      { where: { email } },
    );

    await sendVerificationEmail(email, otp);
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const forgetPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    const hashedOTP = await hashText(otp);

    // Update user with new OTP and expiry
    await User.update(
      { otp: hashedOTP, otpExpires: Date.now() + 10 * 60 * 1000 },
      { where: { email } },
    );

    await sendVerificationEmail(email, otp);
    return res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTPForgetPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const compareOTPs = await compareTexts(otp, user.otp);
    if (!compareOTPs) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ error: "OTP has expired" });
    }
    return res.status(200).json({ message: "You can now reset your password" });
  } catch (error) {
    console.error("Error during OTP verification for forget password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await hashText(password);

    await User.update(
      { password: hashedPassword, otp: null, otpExpires: null },
      { where: { email } },
    );

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const generateNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    const { valid, decoded } = validateRefreshToken(refreshToken);
    if (!valid) {
      return res.status(401).json({
        error: "REFRESH_TOKEN_INVALID",
        message: "Please login again",
      });
    }
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "User not found",
      });
    }
    const newAccessToken = generateAccessToken({
      id: user.id,
    });
    const newRefreshToken = generateRefreshToken({
      id: user.id,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 15 * 60 * 1000,
    });

    res.status(201).json({ message: "Access token refreshed" });
  } catch (error) {
    return res.status(401).json({
      error: "REFRESH_TOKEN_EXPIRED",
      message: "Please login again",
    });
  }
};
