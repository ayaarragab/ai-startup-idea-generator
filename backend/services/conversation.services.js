import db from "../models/index.js";

const { Conversation } = db;

export const findConversation = async (id) => {
  try {
    const conversation = await Conversation.findByPk(id);
    if (conversation) {
      return conversation;
    }
    return null;
  } catch (error) {
    return null;    
  }
}

export const createConversation = async (userId) => {
  try {
    const conversation = await Conversation.create({
    userId
    })
    return conversation;
  } catch (error) {
    return false;
  }
}