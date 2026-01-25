import { hashText } from "../utils/hashing.utils.js";
import { compareTexts } from "../utils/hashing.utils.js";
import { generateOTP, sendVerificationEmail } from "../utils/email.utils.js";
import db from "../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js";

const { User } = db;

export const findUser = async (email) => {
  const user = await User.findOne({
    where: { email },
  });
  
  return user?.toJSON();
};

export const findUserById = async (id) => {
  const user = await User.findByPk(id);
  
  return user?.toJSON();
} 

export const handleExistingUser = async (user, password, res) => {
  
  const isCorrectPassword = await compareTexts(password, user.password);  
  if (isCorrectPassword) {
    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username,
    });
    const refreshToken = generateRefreshToken({
      id: user.id,
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

    return res.status(200).json({
      message: "User logged in successfully",
    });
  } else {
    return res.status(401).json({ message: "Incorrect password" });
  }
};

export const handleNewUser = async (fullName, email, password, res) => {
  const hashedPassword = await hashText(password);
  
  const otp = generateOTP();
  const hashedOTP = await hashText(otp);

  const newUser = await User.create({
    fullName,
    email,
    otp: hashedOTP,
    password: hashedPassword,
    otpExpires: Date.now() + 10 * 60 * 1000,
    isVerified: false,
  });

  const accessToken = generateAccessToken({
    id: newUser.id,
    username: newUser.username,
  });
  const refreshToken = generateRefreshToken({
    id: newUser.id,
    username: newUser.username,
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
  await sendVerificationEmail(email, otp);
  return res.status(200).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    },
  })
};

export const handleOAuthSignup = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken }
}