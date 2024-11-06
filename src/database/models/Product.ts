import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "products",
  modelName: "Product",
  timestamps: true,
})
class Product extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull:false 
  })
  declare productName: string;
  @Column({
    type: DataType.TEXT,
  
  })
  declare description: string;
  @Column({
    type: DataType.INTEGER,
  })
  declare price: number;
  @Column({
    type: DataType.INTEGER
    })
    declare productQuantity: number;
  @Column({
    type: DataType.STRING,
    })
    declare  productImageUrl: string;
}
export default Product;
