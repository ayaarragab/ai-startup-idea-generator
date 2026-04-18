import sendChat from "./ai/index.js";
import { createConversation } from "./conversation.services.js";
import { createMessage } from "./message.services.js";
import { createIdea } from "./idea.services.js";
import { updateConversationTitle } from "./conversation.services.js";
import { fetchSectorsNames } from "./sector.services.js";

export const handleChat = async ({ content, conversationId, userId, isNewConversation, history, clientMessageId, convSectors }) => {
  
  if (isNewConversation) {
    const conversation = await createConversation(userId, convSectors);
    conversationId = conversation.id;
  }

  await createMessage(content, conversationId, 'user', clientMessageId)
  
  const sectorsNames = await fetchSectorsNames(convSectors);
  console.log("type of conv id", typeof conversationId);
  
  const aiResponse = await sendChat({
    content,
    conversationId,
    isNewConversation,
    history,
    clientMessageId,
    convSectors: sectorsNames,
    userId,
  });
  const { idea: _, ...aiResponseWithoutIdea } = aiResponse;
  
  const message = await createMessage(aiResponse.content, aiResponse.conversationId, 'ai', clientMessageId, aiResponse.is_full_idea, aiResponse.is_full_idea)

  let idea__ = null;

  if (aiResponse.is_full_idea) {
    idea__ = await createIdea({ ...aiResponse.data, messageId: message.id }, convSectors);
  }
  
  if (aiResponse.conversation_title) {
        
    await updateConversationTitle(conversationId, aiResponse.conversation_title)
  }

  return { ...aiResponseWithoutIdea, messageId: message.id, clientMessageId, idea: idea__ };
}

export const handleChatWithoutAuth = async ({ content, isNewConversation, history, convSectors }) => {
  try {
    const aiResponse = await sendChat({
      content,
      conversationId: -1,
      isNewConversation: true,
      history,
      clientMessageId: '-11111',
      convSectors,
      userId: -1
    });
    const { data: _, ...aiResponseWithoutIdea } = aiResponse;
    let idea__ = null;

    if (aiResponse.is_full_idea) {
      idea__ = await createIdea({ ...aiResponse.data }, convSectors);
    }
  return { ...aiResponseWithoutIdea, idea: idea__ };
  
  } catch (error) {
    throw error;
  }
}