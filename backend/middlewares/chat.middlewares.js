import { findConversation } from "../services/conversation.services.js";
import { findUserById } from "../services/auth.services.js";

export const validatePrompt = async (req, res, next) => {
  try {
    const { content, conversationId, userId } = req.body;
    let isNewConversation = false;
    if (!content) {
      return res.status(400).json({ error: "Message is required" });
    }
    if (!conversationId) {
      isNewConversation = true;
    } else {
      const isExists = await findConversation(conversationId);
      if (!isExists) {
        return res
          .status(404)
          .json({ error: "This conversation doesn't exist" });
      }
    }
    if (!userId) {
      return res.status(404).json({ error: "userId is required" });
    } else {
      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "This user doesn't exist" });
      }
    }
    req.body.isNewConversation = isNewConversation;
    next();
  } catch (error) {
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};
