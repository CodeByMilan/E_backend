import { Sequelize } from "sequelize-typescript";
import User from "./models/User";
import Product from "./models/Product";
import Category from "./models/Category";
const sequelize = new Sequelize({
  database:process.env.DB_NAME,
  dialect: 'mysql',
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  port: Number(process.env.DB_PORT),
  //models is used to mention where our table code is located
  models: [__dirname +"/models"]
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database");
    console.log("Database:", process.env.DB_NAME);
  })
  .catch((err) => {
    console.error("Unable to connect to database:", err);
  });
//we have to make force true if we want to migrate and again change to false
  sequelize.sync({force:false}).then(()=>{
    console.log("Database synced")
    })

    //relationship of product and user
    User.hasMany(Product,{foreignKey:'userId'})
    Product.belongsTo(User,{foreignKey:'userId'})

    //relationship of category and product
    Product.belongsTo(Category,{foreignKey:'categoryId'})
    Category.hasOne(Product,{foreignKey:'categoryId'})

  
export  default sequelize;
