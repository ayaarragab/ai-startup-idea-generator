export const validateUpdateData = (req, res, next) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName && !email) {
      console.log("Validation Error: Both fullname and email are empty");
      return res.status(400).json({
        error: "INVALID_REQUEST",
        message: "Both fullname and email are empty"
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      console.log("Validation Error: Invalid email format");
      return res.status(400).json({ error: "Invalid email format" });
    }

    const fullNameRegex = /^[A-Za-z\s]{3,50}$/;

    if (!fullName || !fullNameRegex.test(fullName)) {
      console.log("Validation Error: Invalid full name format");
      return res.status(400).json({ error: "Invalid full name format" });
    }

    console.log("Validation Success: Data is valid");
    next();
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Update data isn't valid"
    });
  }
}