const generateIdea = (prompt = '') => {
  return {
    // --- Problem Space ---
    problemTitle: "Students have different learning styles",
    problemDescription: "Traditional education uses one-size-fits-all approaches, leading to disengagement and poor outcomes.",
    rootCause: "Lack of personalized learning experiences in educational systems",
    targetUsers: "K-12 students, Higher education students, Corporate training participants",
    marketRegion: "Egypt or MENA",
    whyNow: "Increased adoption of AI and EdTech post-pandemic",
    evidenceSignals: ["Growing EdTech market", "High demand for personalized learning"],

    // --- Solution Space ---
    solutionName: "AI-Powered Personalized Learning Platform",
    solutionDescription: "A platform that uses machine learning to adapt educational content in real-time based on student performance and learning preferences.",
    howItWorks: ["Analyze student interactions", "Adjust content difficulty and pacing", "Track performance metrics"],
    keyFeatures: ["Adaptive content", "Performance analytics", "Student engagement tracking"],
    technologyStack: ["Machine learning models", "Analytics infrastructure", "Web/Mobile frameworks"],
    retrievedStartups: [],

    // --- Business Model ---
    businessModel: {
      keyPartners: ["Educational institutions", "Content creators", "Analytics providers"],
      keyActivities: ["Content adaptation", "Performance analytics", "Student engagement tracking"],
      keyResources: ["Machine learning models", "Content library", "Analytics infrastructure"],
      valueProposition: ["Improved learning outcomes", "Personalized experience", "Time efficiency"],
      customerRelationships: ["24/7 support", "Progress dashboards", "Regular feedback sessions"],
      channels: ["Web platform", "Mobile app", "School partnerships"],
      customerSegments: ["K-12 students", "Higher education", "Corporate training"],
      costStructure: ["Server infrastructure", "ML model maintenance", "Support staff"],
      revenueStreams: ["Subscription fees", "Institutional licenses", "Premium features"],
      pricingModel: "Freemium + monthly subscription tiers",
      customerAcquisition: ["School partnerships", "Digital marketing", "Referral programs"]
    },

    // --- Market Analysis ---
    marketAnalysis: {
      marketSize: "Large and growing EdTech market in MENA",
      competitors: ["Noon Academy", "Nagwa", "Classera"],
      competitiveAdvantage: "Real-time personalization with localized Arabic-first learning paths"
    },

    // --- Feasibility ---
    feasibility: {
      technicalFeasibility: "Medium",
      marketFeasibility: "High",
      riskFactors: ["Competition from established EdTech", "Data privacy concerns"]
    },

    noveltyScore: 7.5,

    // --- Impact ---
    impact: {
      economicImpact: "Reduces training and tutoring costs while improving education ROI",
      socialImpact: "Improves access to personalized learning and student outcomes"
    },

    // --- MVP Plan ---
    mvpPlan: {
      mvpFeatures: ["Adaptive quizzes", "Student dashboard", "Teacher analytics panel"],
      firstSteps: ["MVP development", "Pilot with 2-3 schools", "Collect feedback and iterate"],
      nextSteps: ["MVP development", "Beta testing with schools", "Series A funding"]
    }
  };
};

const sendChat = async ({ content, conversationId, userId, history, convSectors }) => {
  const idea = generateIdea();
  return {
    content: `Mock reply to: "${content}"`,
    conversationId,
    role: 'ai',
    is_idea: true,
    is_idea_saved: false,
    conversation_title: "Education startup",
    is_full_idea: true,
    idea
  };
};

export default sendChat;