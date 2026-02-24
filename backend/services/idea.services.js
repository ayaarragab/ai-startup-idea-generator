import db from "../models/index.js";

const { Idea, User } = db;

export const createIdea = async (ideaDetails) => {
  try {    
    const idea = await Idea.create({ ...ideaDetails });
    return idea ? idea.toJSON() : null;
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error; // rethrow the error for further handling
  }
}

export const saveIdea = async (ideaId, userId) => {

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const idea = await Idea.findByPk(ideaId);
  if (!idea) throw new Error("Idea not found");

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