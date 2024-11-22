import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PaymentMethod, PaymentStatus } from "src/shared/enums/payment";
import { Order } from "./order";

@Table
export class Payment extends Model {
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    amount: number;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentMethod)),
        allowNull: false
    })
    paymentMethod: PaymentMethod;

    @Column({
        type: DataType.ENUM(...Object.values(PaymentStatus)),
        allowNull: false,
        defaultValue: PaymentStatus.PENDING
    })
    status: PaymentStatus;

    @ForeignKey(() => Order)
    @Column({
        unique: true
    })
    orderId: number;

    @BelongsTo(() => Order)
    order: Order;
}