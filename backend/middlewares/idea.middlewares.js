export const validateIdeaFields = (req, res, next) => {
  const requiredFields = ['ideaId', 'messageId'];

  for (const field of requiredFields) {
    if (!req.body[field]) {      
      return res.status(400).json({ error: `Field ${field} is required and must be valid.` });
    }
  }

  next();
};