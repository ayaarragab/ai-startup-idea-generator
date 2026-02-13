import { updateUserData, updatePassword } from "../services/user.services.js";

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const isUpdated = await updateUserData(id, req.body);

    if (isUpdated) {
      return res.status(200).json({
        message: "User updated successdully",
      });
    } else {      
      return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "Error while updating user",
      });
    }
  } catch (error) {    
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Error while updating user",
    });
  }
};

export const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  
  try {
    const isChanged = await updatePassword(id, newPassword);
    if (isChanged) {
      return res.status(200).json({
        message: "User updated successdully",
      });
    } else {
      return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "Error while updating user",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Error while updating user",
    });
  }
};
