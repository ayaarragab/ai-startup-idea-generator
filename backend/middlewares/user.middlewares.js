export const validateUpdateData = (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName && !email) {
      return res.status(400).json({
        error: "INVALID_REQUEST",
        message: "Both fullname and email are empty"
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const fullNameRegex = /^[A-Za-z\s]{3,50}$/;

    if (!fullName || !fullNameRegex.test(fullName)) {
      return res.status(400).json({ error: "Invalid full name format" });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Update data isn't valid"
    });
  }
}
