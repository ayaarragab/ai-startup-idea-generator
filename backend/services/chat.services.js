import aiClient from "./ai/index.js";

export const handleChat = async ({ message, conversationId, userId }) => {
  const aiResponse = await aiClient.sendChat({
    message,
    conversationId,
    userId
  });
  
  return aiResponse;
}