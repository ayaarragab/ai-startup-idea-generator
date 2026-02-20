import db from "../models/index.js";

const { Conversation, Message, Sector } = db;

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

export const fetchConversations = async (userId) => {
  try {
    const conversations = await Conversation.findAll({
      where: { 
        userId
      },
      include: [
        {
          model: Message,
          as: 'messages'
        },
        {
          model: Sector,
          as: 'sectors'
        }
      ]
    });
    console.log(conversations);
    
    return conversations;
  } catch (error) {
    console.log(error);
    return [];
  }
}