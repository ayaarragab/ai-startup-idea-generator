import app from "./app.js";
import db from "./models/index.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    await db.connection.authenticate();
    await db.connection.sync();
    app.listen(PORT, () => {
      console.log("Hello from ai-startup-idea-generator backend server!");
    });
  } catch (err) {
    console.error("Startup error:", err);
  }
}

startServer();