import db from "../models/index.js";
import { findIdeaWithMessageId } from "./idea.services.js";

const { Conversation, Message, Sector, Idea } = db;

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

    const updatedConversation = await Conversation.findByPk(conversation.id, {
      include: [
        {
          model: db.Sector,
          as: 'sectors',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    return updatedConversation;
  } catch (error) {
    console.error("Create Conversation Error:", error);
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
      where: { id, userId },
      include: [
        {
          model: Message,
          as: "messages",
          include: [{ model: Idea, as: "idea" }],
        },
        { model: Sector, as: "sectors" },
      ],
      order: [[{ model: Message, as: "messages" }, "id", "ASC"]],
    });

    return conversation.toJSON();
  
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
