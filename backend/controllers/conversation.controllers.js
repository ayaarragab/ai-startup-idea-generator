import { fetchConversations } from "../services/conversation.services.js"

export const getConversations = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    
    const conversations = await fetchConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversations", error });
  }
}