import db from "../models/index.js";

const { Idea, usersSavedIdeas } = db;

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
  try {
    const savedIdea = await usersSavedIdeas.create({
      ideaId,
      userId
    });
    return savedIdea ? savedIdea.toJSON() : null;
  } catch (error) {
    console.error("Error saving idea:", error);
    throw error; // rethrow the error for further handling
  }
}

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
