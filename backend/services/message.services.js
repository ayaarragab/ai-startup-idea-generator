import db from "../models/index.js";

const { Message } = db;

export const createMessage = async (content, conversationId, role, clientMessageId='') => {
  try {
    const message = await Message.create({
      content,
      conversationId,
      role,
      clientMessageId
    })
    return message;
  } catch (error) {
    return false;
  }
}

export const findMessageByUUID = async (clientMessageId) => {
  try {
    const message = await Message.findOne({
      where: {
        clientMessageId
      }
    })
    if (message) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}