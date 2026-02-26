import db from "../models/index.js";

const { Message } = db;

export const createMessage = async (content, conversationId, role, clientMessageId, is_idea=false, is_full_idea=false) => {
  try {
    const message = await Message.create({
      content,
      conversationId,
      role,
      clientMessageId,
      is_idea,
      is_full_idea
    })
    return message;
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      const existing = await Message.findOne({
        where: { conversationId, role, clientMessageId },
      });
      return existing;            
    }
    return false;
  }
}

export const findMessage = async (clientMessageId, role, conversationId) => {
  try {
    const message = await Message.findOne({
      where: {
        role,
        conversationId,
        clientMessageId
      }
    })
    if (message) {
      return message;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}