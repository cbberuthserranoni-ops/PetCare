const path = require("node:path");
const mysql = require("mysql2/promise");

require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

const database = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

module.exports = database;