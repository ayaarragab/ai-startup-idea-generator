import { generateIdea } from "../services/ai.services"

export const generateNewIdea = async (req, res) => {
  try {
    const prompt = req.body;
    const generatedIdea = await generateIdea(prompt);
    return res.status(201).json({ generatedIdea });
  } catch (error) {
    return res.status(500).json({ error, message: 'Error while generating idea' });    
  }
}