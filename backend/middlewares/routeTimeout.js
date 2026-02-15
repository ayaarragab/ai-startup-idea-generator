export const routeTimeout = (ms = 6000) => (req, res, next) => {
  res.setTimeout(ms, () => {
    if (!res.headersSent) {
      return res.status(504).json({
        error: { code: "REQUEST_TIMEOUT", message: "Request took too long" }
      });
    }
    next()
  });
}