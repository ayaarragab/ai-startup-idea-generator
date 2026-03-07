import sendChat from "./ai/index.js";
import { createConversation } from "./conversation.services.js";
import { createMessage } from "./message.services.js";
import { createIdea } from "./idea.services.js";

export const handleChat = async ({ content, conversationId, userId, isNewConversation, clientMessageId, history, convSectors }) => {
  
  if (isNewConversation) {
    const conversation = await createConversation(userId, convSectors);
    conversationId = conversation.id;
  }

  await createMessage(content, conversationId, 'user', clientMessageId)

  const aiResponse = await sendChat({
    content,
    conversationId,
    history,
    userId,
    convSectors
  });
  const { idea: _, ...aiResponseWithoutIdea } = aiResponse;
  
  const message = await createMessage(aiResponse.content, aiResponse.conversationId, 'ai', clientMessageId, aiResponse.is_idea, aiResponse.is_full_idea)

  let idea__ = null;

  if (aiResponse.is_idea && aiResponse.is_full_idea) {
    idea__ = await createIdea({ ...aiResponse.idea, messageId: message.id });
  }
  
  
  return { ...aiResponseWithoutIdea, messageId: message.id, clientMessageId, idea: idea__ };
}

export const handleChatWithoutAuth = async ({ content, isNewConversation, history, convSectors }) => {
  try {
    const aiResponse = await sendChat({
      content,
      history,
      convSectors
    });
    const { idea: _, ...aiResponseWithoutIdea } = aiResponse;
    let idea__ = null;

    if (aiResponse.is_idea && aiResponse.is_full_idea) {
      idea__ = await createIdea({ ...aiResponse.idea });
    }
  return { ...aiResponseWithoutIdea, idea: idea__ };
  
  } catch (error) {
    throw error;
  }
}