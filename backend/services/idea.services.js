import db from "../models/index.js";
import { findUserById } from "../services/auth.services.js";

const { Idea, usersSavedIdeas, User } = db;

export const createIdea = async (ideaDetails) => {
  try {
    console.log(ideaDetails);
    
    const idea = await Idea.create({ ...ideaDetails.currentIdea });
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


export const unsaveIdea = async (ideaId, userId) => {
  try {
    const result = await usersSavedIdeas.destroy({
      where: {
      ideaId,
      userId
      }
    });
    return result > 0;
    } catch (error) {
    console.error("Error unsaving idea:", error);
    throw error;
    }
}
