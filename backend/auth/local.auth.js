import { findUser, handleExistingUser, handleNewUser, handleOAuthSignup } from "./helpers.auth.js";
import dotenv from "dotenv";

dotenv.config()

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log({ fullName, email, password });
    
    const user = await findUser(fullName, email);
    if (user) {      
      return await handleExistingUser(user, password, res);
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