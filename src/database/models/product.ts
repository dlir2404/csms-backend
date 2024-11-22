import { Model, Column, Table, DataType, BelongsToMany } from "sequelize-typescript";
import { Category } from './category';
import { ProductCategory } from './product-category';
import { OrderProduct } from "./order-product";
import { Order } from "./order";

@Table
export class Product extends Model {
    @Column
    name: string;

    @Column
    price: number;

    @Column
    thumbnail: string;

    @Column
    available: boolean;

    @BelongsToMany(() => Category, () => ProductCategory)
    categories: Category[];

    @BelongsToMany(() => Order, () => OrderProduct)
    orders: Order[];
}
