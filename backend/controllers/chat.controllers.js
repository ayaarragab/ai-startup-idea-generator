import { handleChat } from "../services/chat.services.js";


export const handleAIChat = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }
    const aiResponse = await handleChat({ ...req.body, userId });
    if (aiResponse) {
      return res.status(201).json(aiResponse);
    }
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}