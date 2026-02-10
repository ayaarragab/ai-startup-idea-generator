import db from "../models/index.js";

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