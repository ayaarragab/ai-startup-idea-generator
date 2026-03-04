import { createFeedback } from "../services/feedback.services.js";

export const sendFeedback = async (req, res) => {
  try {
    const userId = req.user.id;
    const feedbackDetails = req.body;
    console.log(feedbackDetails);
    
    if (!feedbackDetails.ideaId) {
      console.log("Validation failed: ideaId is missing");
      return res.status(400).json({ message: "ideaId is required" });
    }

    if (typeof feedbackDetails.ideaId !== "number") {
      console.log("Validation failed: ideaId is not valid");
      return res.status(400).json({ message: "ideaId must be a valid string" });
    }

    if (feedbackDetails.rating === undefined || feedbackDetails.rating === null) {
      console.log("Validation failed: rating is missing");
      return res.status(400).json({ message: "rating is required" });
    }

    if (
      typeof feedbackDetails.rating !== "number" ||
      feedbackDetails.rating < 1 ||
      feedbackDetails.rating > 5
    ) {
      console.log("Validation failed: rating is not between 1 and 5");
      return res.status(400).json({ message: "rating must be a number between 1 and 5" });
    }

    if (!feedbackDetails.text || typeof feedbackDetails.text !== "string" || !feedbackDetails.text.trim()) {
      console.log("Validation failed: comment is missing or invalid");
      return res.status(400).json({ message: "comment is required" });
    }

    const feedback = await createFeedback({ ...feedbackDetails, userId });
    return res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}