import { DataTypes, Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const connection = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

export default connection;
