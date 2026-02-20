import { fetchConversations, fetchConversation, createConversation } from "../services/conversation.services.js"

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

export const getConversation = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    if (!id) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    
    const conversation = await fetchConversation(userId, id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Error fetching conversation", error });
  }
}

export const createOneConversation = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const conversationData = req.body;
    const newConversation = await createConversation(userId, conversationData);
    
    res.status(201).json(newConversation);
  } catch (error) {
    res.status(500).json({ message: "Error creating conversation", error });
  }
}