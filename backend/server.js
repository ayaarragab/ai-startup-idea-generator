import app from "./app.js";
import db from "./models/index.js";

const PORT = process.env.PORT;

async function startServer() {
  try {
    await db.connection.authenticate();

    // ✅ FIX OLD DATA FIRST
    await db.connection.query(`
      UPDATE ideas
      SET targetUsers = JSON_ARRAY(targetUsers)
      WHERE JSON_VALID(targetUsers) = 0;
    `);

    console.log("✅ targetUsers data fixed");

    // ✅ NOW SAFE TO SYNC
    await db.connection.sync();

    app.listen(PORT, () => {
      console.log("Hello from ai-startup-idea-generator backend server!");
    });

  } catch (err) {
    console.error("Startup error:", err);
  }
}

startServer();