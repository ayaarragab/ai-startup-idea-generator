import db from "../models/index.js";

const { Idea, User, Message } = db;

export const createIdea = async (ideaDetails) => {
  try {
    const idea = await Idea.create({ ...ideaDetails });
    return idea ? idea.toJSON() : null;
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error; // rethrow the error for further handling
  }
}

export const saveIdea = async (ideaId, userId, messageId) => {

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const idea = await Idea.findByPk(ideaId);
  if (!idea) throw new Error("Idea not found");
  
  const message = await Message.findByPk(messageId);
  if (!message) throw new Error("Message not found");

  message.is_idea_saved = true;
  await message.save();
  await user.addIdea(ideaId);

  return { ok: true };
};

export const findIdea = async (id) => {
  try {
    const idea = await Idea.findByPk(id);
    if (!idea) {
      return false; 
    }
    return true;
  } catch (error) {
    return true;
  }
}

export const findIdeaWithMessageId = async (messageId) => {
  try {
    const idea = await Idea.findOne({ where: { messageId } });
    return idea;
  } catch (error) {
    throw error;
  }
};

export const unsaveIdea = async (ideaId, userId, messageId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const idea = await Idea.findByPk(ideaId);
  if (!idea) throw new Error("Idea not found");
  
  const message = await Message.findByPk(messageId);
  if (!message) throw new Error("Message not found");

  message.is_idea_saved = false;
  await message.save();
  await user.removeIdea(ideaId);

  return { ok: true };
};

export const fetchSavedIdeas = async (userId) => {
  try {    
    const user = await User.findByPk(userId);
    const ideas = await user.getIdeas();
    
    return ideas;
  } catch (error) {
    return false;
  }
}