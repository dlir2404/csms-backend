import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { PayRequest, PayResponse, VNPayIpnResultInterBank } from "./payment.dto";
import { plainToInstance } from "class-transformer";

@Controller('/api/payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
    @Post()
    async pay(@Body() body: PayRequest) {
        const result = this.paymentService.pay(body)

        return plainToInstance(PayResponse, result)
    }

    @Get('/ipn/vn-pay')
    async updatePaymentResult(@Query() ipnResult: any) {
        const result = this.paymentService.updatePaymentResult(ipnResult as VNPayIpnResultInterBank)
        return result
    }
}