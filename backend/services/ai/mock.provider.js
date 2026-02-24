const generateIdea = async (prompt='') => {
  return {
    name: "AI-Powered Personalized Learning Platform",
    subtitle: "Adaptive education tailored to individual learning styles",
    description: "A platform that uses machine learning to adapt educational content in real-time based on student performance and learning preferences.",
    problem: "Students have different learning styles, but traditional education uses one-size-fits-all approaches, leading to disengagement and poor outcomes.",
    solution: "Implement AI algorithms to analyze student interactions and automatically adjust content difficulty, format, and pacing.",
    keyPartners: ["Educational institutions", "Content creators", "Analytics providers"],
    keyActivities: ["Content adaptation", "Performance analytics", "Student engagement tracking"],
    keyResources: ["Machine learning models", "Content library", "Analytics infrastructure"],
    valueProposition: ["Improved learning outcomes", "Personalized experience", "Time efficiency"],
    customerRelationships: ["24/7 support", "Progress dashboards", "Regular feedback sessions"],
    channels: ["Web platform", "Mobile app", "School partnerships"],
    customerSegments: ["K-12 students", "Higher education", "Corporate training"],
    costStructure: ["Server infrastructure", "ML model maintenance", "Support staff"],
    revenueStreams: ["Subscription fees", "Institutional licenses", "Premium features"],
    nextSteps: ["MVP development", "Beta testing with schools", "Series A funding"],
    academicReferences: ["Learning science research", "AI in education studies"],
  };
}

const sendChat = async ({ content, conversationId, userId }) => {
  const idea = await generateIdea();
  return {
    content: `Mock reply to: "${content}"`,
    conversationId,
    role: 'ai',
    is_idea: true,
    is_idea_saved: false,
    idea
  };
};

export default sendChat;