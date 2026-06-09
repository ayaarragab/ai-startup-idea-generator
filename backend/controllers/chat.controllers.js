import { handleChat, handleChatWithoutAuth } from "../services/chat.services.js";
import { getDailyIdeasCount } from "../services/idea.services.js";

export const handleAIChat = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'UNAUTHORIZED' });
    }

    const dailyIdeasCount = await getDailyIdeasCount(userId);

    const limitReached = dailyIdeasCount >= 3

    const aiResponse = await handleChat({ ...req.body, userId, limitReached });
    if (aiResponse) {
      return res.status(201).json(aiResponse);
    }
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}

export const handleAIChatWithoutAuth = async (req, res) => {
  try {
    const aiResponse = await handleChatWithoutAuth({ ...req.body });
    if (aiResponse) {
      return res.status(201).json(aiResponse);
    }
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
  }
}