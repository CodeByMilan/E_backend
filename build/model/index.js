"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
//Sequelize class asks for the  database connection(dbname, userrname ,password)sequence is important
const sequelize = new sequelize_1.Sequelize(dbConfig_1.default.db, dbConfig_1.default.user, dbConfig_1.default.password, {
    host: dbConfig_1.default.host,
    dialect: dbConfig_1.default.dialect,
    port: 3306,
    pool: {
        acquire: dbConfig_1.default.pool.acquire,
        min: dbConfig_1.default.pool.min,
        max: dbConfig_1.default.pool.max,
        idle: dbConfig_1.default.pool.idle,
    },
});
//connect
sequelize
    .authenticate()
    .then(() => {
    console.log("Connection has been established successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
//making object
const db = {};
//making key in  object
db.Sequelize = sequelize_1.Sequelize;
db.sequelize = sequelize;
//force means  if table already exist then it will be deleted and new table will be created
db.sequelize
    .sync({ force: false })
    .then(() => {
    console.log("Synced database successfully");
})
    .catch((err) => {
    console.error("Unable to sync the database:", err);
});
exports.default = db;
