import fetch from "node-fetch";

const sendChat = async ({ content, conversationId, isNewConversation, history, clientMessageId, convSectors, lastIdea, userId }) => {
  const response = await fetch(`${process.env.AI_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      conversationId,
      isNewConversation,
      history,
      clientMessageId,
      sectors: convSectors,
      lastIdea
    })
  });
  
  if (!response.ok) {
    throw new Error("AI service error");
  }

  const data = await response.json();
  
  return {
    ...data,
  };
};

export default sendChat;
