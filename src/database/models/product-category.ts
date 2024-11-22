import { Model, Column, Table, ForeignKey, DataType } from "sequelize-typescript";
import { Product } from './product'; 
import { Category } from './category';

@Table
export class ProductCategory extends Model {
    @ForeignKey(() => Product)
    @Column
    productId: number;

    @ForeignKey(() => Category)
    @Column
    categoryId: number;
}
