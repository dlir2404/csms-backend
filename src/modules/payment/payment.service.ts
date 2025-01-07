import { Injectable } from "@nestjs/common";
import { Order, Payment } from "src/database/models";
import { PayRequest } from "./payment.dto";
import { PaymentStatus } from "src/shared/enums/payment";

@Injectable()
export class PaymentService {

    async pay(body: PayRequest) {
        const order = await Order.findByPk(body.orderId)

        const payment = {
            subtotal: order.totalPrice,
            vat: order.totalPrice / 10,
            discount: body.discount || 0,
            total: body.total,
            paymentMethod: body.paymentMethod,
            status: PaymentStatus.COMPLETED,
            orderId: order.id
        }

        const createdPayment = await Payment.create(payment)
        
        return createdPayment
    }
}