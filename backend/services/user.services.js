import db from "../models/index.js";
import { hashText } from "../utils/hashing.utils.js";

const { User } = db;

export const updateUserData = async (id) => {
  try {
    await User.update(
      { ...req.body },
      {
        where: {
          id
        }
      }
    )
    return true;
  } catch (error) {
    return false;
  }
}

export const updatePassword = async (id, newPassword) => {
  const hashed = await hashText(newPassword);
  try {
    await User.update(
      { password: hashed },
      {
        where: {
          id,
        },
      },
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};