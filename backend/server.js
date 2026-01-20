import app from "./app.js";
import db from "./models/index.js";

const PORT = process.env.PORT;

db.connection.sync({ alter: true }).then(
    () => {
        app.listen(PORT, () => {
            console.log('Hello from ai-startup-idea-generator backend server!');
        })
    }
)