import db from "../models/index.js";

const { Message } = db;

export const createMessage = async (content, conversationId, role) => {
  try {
    const message = await Message.create({
      content,
      conversationId,
      role
    })
    return message;
  } catch (error) {
    return false;
  }
}