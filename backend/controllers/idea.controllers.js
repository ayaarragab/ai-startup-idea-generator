import { findIdea, saveIdea, unsaveIdea, fetchSavedIdeas, fetchSavedIdea } from "../services/idea.services.js";

export const saveUserIdea = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ideaId, messageId } = req.body;

    const idea = await findIdea(ideaId);
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const ideaSaved = await saveIdea(ideaId, userId, messageId);
    
    if (!ideaSaved) {
      return res.status(400).json({ message: "Failed to save idea." });      
    }
    
    return res.status(200).json({ message: 'Idea saved successflly' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }  
}

export const unsaveUserIdea = async (req, res) => {
  try {
    const userId = req.user.id;
    const messageId  = req.params.messageid;
    const ideaId = req.params.id;

    const idea = await findIdea(ideaId);
    
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    const ideaUnsaved = await unsaveIdea(ideaId, userId, messageId);
    
    if (!ideaUnsaved) {
      return res.status(400).json({ message: "Failed to unsave idea." });      
    }
    
    return res.status(200).json({ message: 'Idea unsaved successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const getSavedIdeas = async (req, res) => {
  try {
    const userId = req.user.id;
    const ideas = await fetchSavedIdeas(userId);
    if (ideas.length > 0) {
      return res.status(200).json({ ideas });
    } else {
      return res.status(404).json({ message: "No saved ideas found." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
}

export const getSavedIdea = async (req, res) => {
  try {
    const userId = req.user.id;
    const ideaId = req.params.id;
    
    const idea = await fetchSavedIdea(userId, ideaId);
    
    if (!idea) {
      return res.status(404).json({ message: "Saved idea not found" });
    }
    
    return res.status(200).json({ idea });
    } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
    }
}