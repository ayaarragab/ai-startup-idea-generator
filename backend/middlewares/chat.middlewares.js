import { findConversation } from "../services/conversation.services.js";
import { findMessageByUUID } from "../services/message.services.js";

export const validatePrompt = async (req, res, next) => {
  try {
    const { content, conversationId, clientMessageId } = req.body;
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
    if (!clientMessageId) {
      return res.status(400).json({ error: "Client message ID is required" });
    }
    const alreadyExists = await findMessageByUUID(clientMessageId);
    if (alreadyExists) {
      return res.status(409).json({ error: "Message with this ID already sent" });
    }
    req.body.isNewConversation = isNewConversation;
    next();
  } catch (error) {
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const validateMessageLength = (req, res, next) => {
  const { content } = req.body;
  const MAX_MESSAGE_LENGTH = 1000; // Set your desired maximum length

  if (content.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` });
  }
  next();
};