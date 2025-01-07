import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { PaymentMethod, PaymentStatus } from "src/shared/enums/payment";
import { Order } from "./order";

@Table
export class Payment extends Model {
    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    subtotal: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    vat: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    discount: number;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: false
    })
    total: number;

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