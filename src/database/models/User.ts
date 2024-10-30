import {
  Table,
  Column,
  Model,
  DataType,
  
} from "sequelize-typescript";

@Table({
  //table name is seen in database phpmyadmin
  tableName: "users",
  //modelname is name which is used to access table throughout the project
  modelName: "User",
  //timestamps is used to add created_at and updated_at columns in the table
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
  })
  declare username: string;
  @Column({
    type: DataType.STRING,
  })
  declare email: string;
  @Column({
    type: DataType.STRING,
  })
  declare password: string;
}
export default User