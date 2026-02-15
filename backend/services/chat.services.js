import sendChat from "./ai/index.js";
import { createConversation } from "./conversation.services.js";
import { createMessage } from "./message.services.js";

export const handleChat = async ({ content, conversationId, userId, isNewConversation, clientMessageId }) => {
  
  if (isNewConversation) {
    const conversation = await createConversation(userId);
    conversationId = conversation.id;
  }

  await createMessage(content, conversationId, 'user', clientMessageId)

  const aiResponse = await sendChat({
    content,
    conversationId,
    userId
  });

  const message = await createMessage(aiResponse.content, aiResponse.conversationId, 'ai')
  
  return { ...aiResponse, messageId: message.id };
}