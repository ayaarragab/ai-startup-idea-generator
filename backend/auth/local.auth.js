import { findUser, handleExistingUser, handleNewUser, handleOAuthSignup } from "./helpers.auth.js";
import dotenv from "dotenv";

dotenv.config()

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
    const { username, email } = req.user;
    const user = await findUser(username, email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleOAuthTokens = (req, res, user, info) => {  
  if (info === 'registered') {
    const { accessToken, refreshToken } = handleOAuthSignup({ email: user.email, username: user.username });

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
    return res.redirect(`http://localhost:${process.env.FRONTEND_PORT}/login`)
  } else if (info === 'loggedin') {
      return res.redirect(`http://localhost:${process.env.FRONTEND_PORT}/dashboard`)
  }
}