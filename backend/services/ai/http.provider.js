import fetch from "node-fetch";

const sendChat = async ({ message, conversationId, userId }) => {
  const response = await fetch(`${process.env.AI_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.AI_API_KEY}`
    },
    body: JSON.stringify({
      message,
      conversationId,
      userId
    })
  });

  if (!response.ok) {
    throw new Error("AI service error");
  }

  const data = await response.json();

  return {
    reply: data.reply,
    meta: {
      provider: "http"
    }
  };
};

export default {
  sendChat
};
