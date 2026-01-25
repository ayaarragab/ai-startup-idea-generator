import {
  findUser,
  findUserById,
  handleExistingUser,
  handleNewUser,
  handleOAuthSignup,
} from "./helpers.auth.js";
import dotenv from "dotenv";

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
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "Strict",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    sameSite: "Strict",
  });
  if (info === "registered") {
    return res.redirect(`http://localhost:${process.env.FRONTEND_PORT}/login`);
  } else if (info === "loggedin") {
    req.user = user;
    return res.redirect(
      `http://localhost:${process.env.FRONTEND_PORT}/dashboard`,
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

    if (user.emailOTP !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    user.isVerified = true;
    user.emailOTP = null; // Clear the OTP after successful verification
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error during email verification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};