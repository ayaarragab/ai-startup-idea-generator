import rateLimit from "express-rate-limit";

export const chatRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip);
  },
  message: {
    error: { code: "RATE_LIMITED", message: "Too many messages. Try again shortly." }
  }, 
})