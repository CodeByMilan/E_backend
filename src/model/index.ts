// import { Sequelize, DataTypes } from "sequelize";
// import dbConfig from "../config/dbConfig";

// //Sequelize class asks for the  database connection(dbname, userrname ,password)sequence is important
// const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
//   host: dbConfig.host,
//   dialect: dbConfig.dialect,
//   port: 3306,
//   pool: {
//     acquire: dbConfig.pool.acquire,
//     min: dbConfig.pool.min,
//     max: dbConfig.pool.max,
//     idle: dbConfig.pool.idle,
//   },
// });

// //connect
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch((err: any) => {
//     console.error("Unable to connect to the database:", err);
//   });
// //making object
// const db: any = {};
// //making key in  object
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// //force means  if table already exist then it will be deleted and new table will be created
// db.sequelize
//   .sync({ force: false })
//   .then(() => {
//     console.log("Synced database successfully");
//   })
//   .catch((err: any) => {
//     console.error("Unable to sync the database:", err);
//   });

//   export default db ;
