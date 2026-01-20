import {
  validateAccessToken,
  validateRefreshToken,
} from "../utils/jwt.utils.js";

export const validateCredentials = (req, res, next) => {
  const { username, email, password } = req.body; // Extract email, password, and username from the request body

  // Regular expression to validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regular expression to validate password format:
  // - At least 8 characters
  // - At least one lowercase letter
  // - At least one uppercase letter
  // - At least one digit
  // - At least one special character (@, $, !, %, *, ?, &)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Regular expression to validate username format:
  // - Only alphanumeric characters and underscores
  // - Between 3 and 20 characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  // Check if email is provided and matches the regex
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" }); // Respond with error if email is invalid
  }

  // Check if password is provided and matches the regex
  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({ error: "Invalid password format" }); // Respond with error if password is invalid
  }

  // Check if username is provided and matches the regex
  if (!username || !usernameRegex.test(username)) {
    return res.status(400).json({ error: "Invalid username format" }); // Respond with error if username is invalid
  }

  // If email, password, and username are valid, proceed to the next middleware or route handler
  next();
};

export const authenticate = (req, res, next) => {
    try {
        // Extract token from the "Authorization" header
        const accessToken = req.cookies.accessToken;
    
        if (!accessToken) {
          return res.status(401).json({
            message: "Access denied. No access token provided.",
            shouldLogout: true
          });
        }
        try {
          const { valid, decoded } = validateAccessToken(accessToken);
          if (valid) {
            req.user = decoded;
            next();
          } else {
            return res.status(401).json({
              message: "Invalid token",
              shouldLogout: true
            });
            }
        } catch (jwtError) {
          if (jwtError.name === 'TokenExpiredError') {
            return res.status(401).json({
              message: "Token expired",
              isExpired: true,
              shouldLogout: true
            });
          }
          return res.status(401).json({
            message: "Invalid token",
            shouldLogout: true
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({
          message: "Server error",
          shouldLogout: true
        });
      }
};
