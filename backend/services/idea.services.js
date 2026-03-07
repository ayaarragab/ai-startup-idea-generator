import db from "../models/index.js";

const { Idea, User, Message } = db;

export const createIdea = async (ideaDetails, convSectors) => {
  try {
    const mappedData = {
      messageId: ideaDetails.messageId,
      problemTitle: ideaDetails.problem_title,
      problemDescription: ideaDetails.problem_description,
      rootCause: ideaDetails.root_cause,
      targetUsers: ideaDetails.target_users,
      marketRegion: ideaDetails.market_region,
      whyNow: ideaDetails.why_now,
      evidenceSignals: ideaDetails.evidence_signals,
      
      solutionName: ideaDetails.solution_name,
      solutionDescription: ideaDetails.solution_description,
      howItWorks: ideaDetails.how_it_works,
      keyFeatures: ideaDetails.key_features,
      technologyStack: ideaDetails.technology_stack,
      
      businessModel: ideaDetails.business_model,
      marketAnalysis: ideaDetails.market_analysis,
      feasibility: ideaDetails.feasibility,
      noveltyScore: ideaDetails.novelty_score,
      impact: ideaDetails.impact,
      mvpPlan: ideaDetails.mvp_plan,
      retrivedStartups: ideaDetails.retrived_startups,

      is_deleted: ideaDetails.is_deleted || false
    };
    const idea = await Idea.create({ ...mappedData });
    if (convSectors.length > 0) {
      await idea.setSectors(convSectors);
    }

    const updatedIdea = await Idea.findByPk(idea.id, {
      include: [
        {
          model: db.Sector,
          as: 'sectors',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    })

    return updatedIdea ? updatedIdea.toJSON() : null;
  } catch (error) {
    console.error("Error creating idea:", error);
    throw error; // rethrow the error for further handling
  }
}

export const saveIdea = async (ideaId, userId, messageId) => {

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const idea = await Idea.findByPk(ideaId);
  if (!idea) throw new Error("Idea not found");
  
  const message = await Message.findByPk(messageId);
  if (!message) throw new Error("Message not found");

  message.is_idea_saved = true;
  await message.save();
  await user.addIdea(ideaId);

  return { ok: true };
};

export const findIdea = async (id) => {
  try {
    const idea = await Idea.findByPk(id);
    if (!idea) {
      return false; 
    }
    return true;
  } catch (error) {
    return true;
  }
}

export const findIdeaWithMessageId = async (messageId) => {
  try {
    const idea = await Idea.findOne({ where: { messageId } });
    return idea;
  } catch (error) {
    throw error;
  }
};

export const unsaveIdea = async (ideaId, userId, messageId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const idea = await Idea.findByPk(ideaId);
  if (!idea) throw new Error("Idea not found");
  
  const message = await Message.findByPk(messageId);
  if (message) {
    message.is_idea_saved = false;
    await message.save();
  };

  await user.removeIdea(ideaId);

  return { ok: true };
};

export const fetchSavedIdeas = async (userId) => {
  try {    
    const user = await User.findByPk(userId);
    const ideas = await user.getIdeas();
    for (const idea of ideas) {
      const sectors = await idea.getSectors();
      const sectorJson = Array.isArray(sectors)
        ? sectors.map((sector) => sector.toJSON())
        : [];
      idea.dataValues.sectors = sectorJson;
    }
          
    return ideas.sort((a, b) => b.createdAt - a.createdAt);

  } catch (error) {
    return false;
  }
}

export const fetchSavedIdea = async (userId, ideaId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");
    
    const ideas = await user.getIdeas({ where: { id: ideaId } });
    
    const ideasJSON = ideas[0].toJSON();
    const sectorsJSON = await ideas[0].getSectors();

    return ideas.length > 0 ? { ...ideasJSON, sectors: sectorsJSON } : null;
  } catch (error) {
    console.error("Error fetching saved idea:", error);
    throw error;
  }
}