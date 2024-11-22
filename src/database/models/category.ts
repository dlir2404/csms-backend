import { Model, Column, Table, BelongsToMany } from "sequelize-typescript";
import { Product } from './product';
import { ProductCategory } from './product-category';

@Table
export class Category extends Model {
    @Column
    name: string;

    @BelongsToMany(() => Product, () => ProductCategory)
    products: Product[];
}
