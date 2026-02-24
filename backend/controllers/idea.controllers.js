import { createIdea, saveIdea } from "../services/idea.services.js";

export const saveUserIdea = async (req, res) => {
  try {
    const ideaDetails = req.body;
    const userId = req.user.id;
    const idea = await createIdea(ideaDetails);
    if (!idea) {
      return res.status(400).json({ message: "Failed to create idea." });
    }
    const ideaSaved = await saveIdea(idea.id, userId);
    if (!ideaSaved) {
      return res.status(400).json({ message: "Failed to save idea." });      
    }
    return res.status(201).json({ message: 'Idea saved successflly' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }  
}