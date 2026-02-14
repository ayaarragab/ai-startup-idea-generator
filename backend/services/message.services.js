import db from "../models/index.js";

const { Message } = db;

export const createMessage = async (content, conversationId, userId, role) => {
  try {
    const message = await Message.create({
      content,
      conversationId,
      userId,
      role
    })
    return message;
  } catch (error) {
    return false;
  }
}