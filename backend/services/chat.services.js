import sendChat from "./ai/index.js";
import { createConversation } from "./conversation.services.js";
import { createMessage } from "./message.services.js";

export const handleChat = async ({ content, conversationId, userId, isNewConversation }) => {
  
  if (isNewConversation) {
    const conversation = await createConversation(userId);
    conversationId = conversation.id;
  }

  await createMessage(content, conversationId, userId, 'user')

  const aiResponse = await sendChat({
    content,
    conversationId,
    userId
  });

  await createMessage(content, conversationId, userId, 'ai')
  
  return aiResponse;
}