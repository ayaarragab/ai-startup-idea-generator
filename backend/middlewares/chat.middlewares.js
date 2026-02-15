import { findConversation } from "../services/conversation.services.js";
import { findMessage } from "../services/message.services.js";

const validateFieldsExistence = (req, res) => {
  const { clientMessageId } = req.body;

  if (!clientMessageId) {
    res.status(400).json({ error: "Client message ID is required" });
    return true; // responded
  }
  return false;
};

const validateConversationId = async (req, res) => {
  const { conversationId } = req.body;

  if (!conversationId) {
    return { responded: false, isNewConversation: true };
  }

  const convo = await findConversation(conversationId);
  if (!convo) {
    res.status(404).json({ error: "This conversation doesn't exist" });
    return { responded: true };
  }

  if (convo.userId !== req.user.id) {
    res.status(403).json({ error: "You do not have permission to access this conversation" });
    return { responded: true };
  }

  return { responded: false, isNewConversation: false };
};

const validateMessage = async (req, res) => {
  const { conversationId, clientMessageId } = req.body;

  const msgAlreadyExists = await findMessage(clientMessageId, "user", conversationId);

  if (!msgAlreadyExists) return false;

  const aiResponseExists = await findMessage(clientMessageId, "ai", conversationId);

  if (aiResponseExists) {
    res.status(200).json({ ...aiResponseExists.dataValues });
    return true;
  }

  res.status(409).json({ error: "IN_PROGRESS" });
  return true;
};

export const validatePrompt = async (req, res, next) => {
  try {
    if (validateFieldsExistence(req, res)) return;

    const convoCheck = await validateConversationId(req, res);
    if (convoCheck.responded) return;

    const responded = await validateMessage(req, res);
    if (responded) return;

    req.body.isNewConversation = convoCheck.isNewConversation;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
};

export const validateMessageLength = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Message is required" });
  }
  const MAX_MESSAGE_LENGTH = 1000; // Set your desired maximum length

  if (content.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message must be less than ${MAX_MESSAGE_LENGTH} characters` });
  }
  next();
};