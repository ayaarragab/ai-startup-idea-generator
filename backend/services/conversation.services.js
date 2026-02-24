import db from "../models/index.js";
import { findIdeaWithMessageId } from "./idea.services.js";

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
};

export const createConversation = async (userId, sectorIds = []) => {
  try {
    const conversation = await Conversation.create({ userId });

    if (sectorIds.length > 0) {
      await conversation.setSectors(sectorIds);
    }
    return conversation;
  } catch (error) {
    return false;
  }
};

export const fetchConversations = async (userId) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Message,
          as: "messages",
        },
        {
          model: Sector,
          as: "sectors",
        },
      ],
    });

    return conversations.filter((c) => !c.is_deleted);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchConversation = async (userId, id) => {
  try {
    const conversation = await Conversation.findOne({
      where: {
        id,
        userId,
      },
      include: [
        {
          model: Message,
          as: "messages",
        },
        {
          model: Sector,
          as: "sectors",
        },
      ],
      order: [[{ model: Message, as: "messages" }, "id", "ASC"]],
    });

    const convMessages = conversation.messages;
    
    let messagesWithIdeas = []

    convMessages.map(async (m) => {
      const idea = await findIdeaWithMessageId(m.id);
      if (idea) {
        messagesWithIdeas.push({ message: m, idea });
      }
    })
    const updatedConversation = { id: conversation.dataValues.id, userId: conversation.dataValues.userId, is_deleted: conversation.dataValues.is_deleted, createdAt: conversation.dataValues.createdAt, updatedAt: conversation.dataValues.updatedAt, messages: messagesWithIdeas, sectors: conversation.sectors };
    console.log(updatedConversation);
    
    return updatedConversation;
  
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteConversation = async (id) => {
  try {
    await Conversation.update(
      {
        is_deleted: true,
      },
      {
        where: {
          id,
        },
      },
    );
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
};
