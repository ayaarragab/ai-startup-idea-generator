const generateIdea = async (prompt = '') => {
  return {
    // --- Problem Space ---
    problem_title: "Students have different learning styles",
    problem_description: "Traditional education uses one-size-fits-all approaches, leading to disengagement and poor outcomes.",
    root_cause: "Lack of personalized learning experiences in educational systems",
    target_users: "K-12 students, Higher education students, Corporate training participants",
    market_region: "Egypt or MENA",
    why_now: "Increased adoption of AI and EdTech post-pandemic",
    evidence_signals: ["Growing EdTech market", "High demand for personalized learning"],

    // --- Solution Space ---
    solution_name: "AI-Powered Personalized Learning Platform",
    solution_description: "A platform that uses machine learning to adapt educational content in real-time based on student performance and learning preferences.",
    how_it_works: ["Analyze student interactions", "Adjust content difficulty and pacing", "Track performance metrics"],
    key_features: ["Adaptive content", "Performance analytics", "Student engagement tracking"],
    technology_stack: ["Machine learning models", "Analytics infrastructure", "Web/Mobile frameworks"],
    retrieved_startups: [],

    // --- Business Model ---
    business_model: {
      key_partners: ["Educational institutions", "Content creators", "Analytics providers"],
      key_activities: ["Content adaptation", "Performance analytics", "Student engagement tracking"],
      key_resources: ["Machine learning models", "Content library", "Analytics infrastructure"],
      value_proposition: ["Improved learning outcomes", "Personalized experience", "Time efficiency"],
      customer_relationships: ["24/7 support", "Progress dashboards", "Regular feedback sessions"],
      channels: ["Web platform", "Mobile app", "School partnerships"],
      customer_segments: ["K-12 students", "Higher education", "Corporate training"],
      cost_structure: ["Server infrastructure", "ML model maintenance", "Support staff"],
      revenue_streams: ["Subscription fees", "Institutional licenses", "Premium features"],
      pricing_model: "Freemium + monthly subscription tiers",
      customer_acquisition: ["School partnerships", "Digital marketing", "Referral programs"]
    },

    // --- Market Analysis ---
    market_analysis: {
      market_size: "Large and growing EdTech market in MENA",
      competitors: ["Noon Academy", "Nagwa", "Classera"],
      competitive_advantage: "Real-time personalization with localized Arabic-first learning paths"
    },

    // --- Feasibility ---
    feasibility: {
      technical_feasibility: "Medium",
      market_feasibility: "High",
      risk_factors: ["Competition from established EdTech", "Data privacy concerns"]
    },

    novelty_score: 7.5,

    // --- Impact ---
    impact: {
      economic_impact: "Reduces training and tutoring costs while improving education ROI",
      social_impact: "Improves access to personalized learning and student outcomes"
    },

    // --- MVP Plan ---
    mvp_plan: {
      mvp_features: ["Adaptive quizzes", "Student dashboard", "Teacher analytics panel"],
      first_steps: ["MVP development", "Pilot with 2-3 schools", "Collect feedback and iterate"],
      next_steps: ["MVP development", "Beta testing with schools", "Series A funding"]
    }
  };
};

const sendChat = async ({ content, conversationId, userId, history, convSectors }) => {
  const idea = await generateIdea();
  return {
    content: `Mock reply to: "${content}"`,
    conversationId,
    role: 'ai',
    is_idea: true,
    is_idea_saved: false,
    is_full_idea: true,
    idea
  };
};

export default sendChat;