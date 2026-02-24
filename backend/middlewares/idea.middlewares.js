export const validateIdeaFields = (req, res, next) => {
  const requiredFields = [
    'name',
    'subtitle',
    'description',
    'problem',
    'solution',
    'keyPartners',
    'keyActivities',
    'keyResources',
    'valueProposition',
    'customerRelationships',
    'channels',
    'customerSegments',
    'costStructure',
    'revenueStreams',
    'nextSteps',
    'academicReferences'
  ];

  for (const field of requiredFields) {
    if (!req.body[field] || (Array.isArray(req.body[field]) && req.body[field].length === 0)) {
      
      return res.status(400).json({ error: `Field ${field} is required and must be valid.` });
    }
  }

  next();
};

