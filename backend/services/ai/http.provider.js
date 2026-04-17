import fetch from "node-fetch";

// لما تيجي تربطي اعملي موضوع الtimeout متنسيش 
const sendChat = async ({ content, conversationId, isNewConversation, history, clientMessageId, convSectors, userId }) => {
  console.log(
    { content, conversationId, isNewConversation, history, clientMessageId, convSectors, userId }
  );
  
  const response = await fetch(`${process.env.AI_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      conversationId,
      isNewConversation,
      data: history,
      clientMessageId,
      sectors: convSectors,
    })
  });
  
  if (!response.ok) {
    throw new Error("AI service error");
  }

  const data = await response.json();
  console.log(data);
  console.log("body");
  console.log(data.body);
  
  return {
    reply: data,
    meta: {
      provider: "http"
    }
  };
};

export default sendChat;
