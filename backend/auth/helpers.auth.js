import { hashPassword } from "../utils/hashing.utils.js";
import { comparePasswords } from "../utils/hashing.utils.js";

import db from "../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js";

const { User } = db;

export const findUser = async (fullName, email) => {
  const user = await User.findOne({
    where: { email },
  });
  
  return user?.toJSON();
};

export const handleExistingUser = async (user, password, res) => {  
  console.log(password,user.password);
  const isCorrectPassword = await comparePasswords(password, user.password);  
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
  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
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