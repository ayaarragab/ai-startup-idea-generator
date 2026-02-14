export const generateIdea = async (prompt) => {
  return {
    name: "Sample Idea Name",
    subtitle: "Sample Idea Subtitle",
    description: "This is a sample description of the idea.",
    problem: "This is the problem the idea addresses.",
    solution: "This is the proposed solution.",
    keyPartners: [],
    keyActivities: [],
    keyResources: [],
    valueProposition: [],
    customerRelationships: [],
    channels: [],
    customerSegments: [],
    costStructure: [],
    revenueStreams: [],
    nextSteps: [],
    academicReferences: [],
  };
}

const sendChat = async ({ content, conversationId, userId }) => {
  return {
    content: `Mock reply to: "${content}"`,
    conversationId,
    role: 'ai'
  };
};

export default sendChat;