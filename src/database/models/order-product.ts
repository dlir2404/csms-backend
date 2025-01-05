import { Model, Column, Table, ForeignKey, DataType, BelongsTo } from "sequelize-typescript";
import { Product } from './product';
import { Order } from "./order";

@Table
export class OrderProduct extends Model {
    @ForeignKey(() => Order)
    @Column
    orderId: number;

    @BelongsTo(() => Order, 'orderId')
    order: Order;

    @ForeignKey(() => Product)
    @Column
    productId: number;

    @BelongsTo(() => Product, 'productId')
    product: Product;

    @Column
    quantity: number;
}
