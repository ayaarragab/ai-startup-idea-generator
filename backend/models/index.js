import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connection from '../config/database.js';
import Sequelize from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

let db = {}

const basename = path.basename(__filename)

const modelFiles = fs.readdirSync(__dirname).filter(
  (file) =>
    file.indexOf('.') !== 0 &&
    file.endsWith('.model.js') &&
    file !== basename
);

for (const file of modelFiles) {
  const { default: modelFunc } = await import(path.join(__dirname, file));
  const definedModel = modelFunc(connection, Sequelize.DataTypes);
  db[definedModel.name] = definedModel;
}


Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  
db.connection = connection;
db.Sequelize = Sequelize;

// User <-> Conversation associations
db.User.hasMany(db.Conversation, {
  foreignKey: "userId",
  as: "coversations",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.Conversation.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user"
});

// Conversation <-> Message associations
db.Conversation.hasMany(db.Message, {
  foreignKey: "conversationId",
  as: "messages",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
});

db.Message.belongsTo(db.Conversation, {
  foreignKey: "conversationId",
  as: "conversation"
});

// Idea <-> Sector associations (many-to-many)
db.Idea.belongsToMany(db.Sector, {
  through: "ideasSectors",
  foreignKey: "ideaId",
  otherKey: "sectorId"
});

db.Sector.belongsToMany(db.Idea, {
  through: "ideasSectors",
  foreignKey: "sectorId",
  otherKey: "ideaId"
});

// Idea <-> TargetUsers associations (many-to-many)
db.Idea.belongsToMany(db.TargetUsers, {
  through: "ideasTargetUsers",
  foreignKey: "ideaId",
  otherKey: "TargetUsersId"
});

db.TargetUsers.belongsToMany(db.Idea, {
  through: "ideasTargetUsers",
  foreignKey: "TargetUsersId",
  otherKey: "ideaId"
});

// Conversation <-> Sector associations (many-to-many)
db.Conversation.belongsToMany(db.Sector, {
  through: "conversationsSectors",
  foreignKey: "conversationId",
  otherKey: "sectorId",
  as: "sectors"
});

db.Sector.belongsToMany(db.Conversation, {
  through: "conversationsSectors",
  foreignKey: "sectorId",
  otherKey: "conversationId",
  as: "conversations"
});

export default db;