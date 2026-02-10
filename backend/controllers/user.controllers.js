import db from "../models/index.js";
import { hashText } from "../utils/hashing.utils.js";

const { User } = db;

export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.update(
      { ...req.body },
      {
        where: {
          id
        }
      }
    )
    return res.status(200).json({
      message: 'User updated successdully'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Error while updating user"
    })
  }
}

export const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const hashed = await hashText(newPassword)
  try {
    await User.update(
      { password: hashed },
      {
        where: {
          id
        }
      }
    )
    console.log("password changed successfully");
    return res.status(200).json({
      message: 'User updated successdully'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Error while updating user"
    })
  }
}
