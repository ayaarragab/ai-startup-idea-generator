import db from "../models/index.js";

const { Feedback } = db;

export const createFeedback = async ({ userId, ideaId, rating, text='' }) => {
  try {
    const feedback = await Feedback.create({
      userId, ideaId, rating, text
    });
    return feedback ? feedback.toJSON() : null;
  } catch (error) {
    throw error;
  }
}