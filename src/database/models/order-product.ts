import { Model, Column, Table, ForeignKey, DataType } from "sequelize-typescript";
import { Product } from './product'; 
import { Order } from "./order";

@Table
export class OrderProduct extends Model {
    @ForeignKey(() => Order)
    @Column
    orderId: number;

    @ForeignKey(() => Product)
    @Column
    productId: number;

    @Column
    quantity: number;
}
