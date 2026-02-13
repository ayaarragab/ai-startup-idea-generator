export const validateIdeaInputs = (req, res, next) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid input: prompt is required and must be a non-empty string.' });
  }

  next();
};