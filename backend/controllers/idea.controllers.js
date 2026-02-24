import { findIdea, saveIdea } from "../services/idea.services.js";

export const saveUserIdea = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ideaId } = req.body;
        
    const idea = await findIdea(ideaId);
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const ideaSaved = await saveIdea(ideaId, userId);
    
    if (!ideaSaved) {
      return res.status(400).json({ message: "Failed to save idea." });      
    }
    
    return res.status(200).json({ message: 'Idea saved successflly' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }  
}