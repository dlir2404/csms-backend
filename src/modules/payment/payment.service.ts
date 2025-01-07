import { Injectable } from "@nestjs/common";
import { Order, Payment } from "src/database/models";
import { PayRequest, VNPayIpnResponse, VNPayIpnResultInterBank } from "./payment.dto";
import { PaymentMethod, PaymentStatus } from "src/shared/enums/payment";
import { sortObject } from "src/shared/helpers/vnPay.fn";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PaymentService {
    public constructor(
        private readonly configService: ConfigService
    ) {}

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

    async updatePaymentResult(vnp_Params: VNPayIpnResultInterBank) {
        var secureHash = vnp_Params['vnp_SecureHash'];
    
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
    
        vnp_Params = sortObject(vnp_Params);
        var secretKey = this.configService.get<string>('vnp_HashSecret');
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        if(secureHash === signed){
            var orderId = vnp_Params['vnp_TxnRef'];
            
            const order = await Order.findOne({ where: { id: orderId }})
            if (!order) {
                return new VNPayIpnResponse("01", "Order not found");
            }

            const payment = {
                subtotal: order.totalPrice,
                vat: order.totalPrice / 10,
                total: +vnp_Params['vnp_Amount'] / 100,
                discount: order.totalPrice * 1.1 - (+vnp_Params['vnp_Amount'] / 100),
                paymentMethod: PaymentMethod.VNPAY,
                orderId: order.id,
                status: PaymentStatus.PENDING
            }

            if (vnp_Params['vnp_ResponseCode'] !== "00") {
                payment.status = PaymentStatus.FAILED
            } else {
                payment.status = PaymentStatus.COMPLETED
            }

            await Payment.create(payment);
            return new VNPayIpnResponse("00", "Success");
        }
        else {
            return new VNPayIpnResponse("97", "Fail checksum")
        }
    }
}