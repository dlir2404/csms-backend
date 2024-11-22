import { Model, Column, Table, DataType, BelongsToMany, BelongsTo, ForeignKey, HasOne } from "sequelize-typescript";
import { Product } from "./product";
import { User } from "./user";
import { OrderStatus } from "src/shared/enums/order";
import { OrderProduct } from "./order-product";
import { Payment } from "./payment";

@Table
export class Order extends Model {
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    totalPrice: number;

    @BelongsToMany(() => Product, () => OrderProduct)
    products: Product[];

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    note: string;

    @Column({
        type: DataType.ENUM(...Object.values(OrderStatus)),
        allowNull: false,
        defaultValue: OrderStatus.CREATED
    })
    status: OrderStatus;

    @ForeignKey(() => User)
    @Column
    createdById: number;

    @BelongsTo(() => User, 'createdById')
    createdBy: User;

    @ForeignKey(() => User)
    @Column
    processById: number;

    @BelongsTo(() => User, 'processById')
    processBy: User;

    @HasOne(() => Payment)
    payment: Payment;
}