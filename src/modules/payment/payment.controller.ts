import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { PayRequest, PayResponse } from "./payment.dto";
import { plainToInstance } from "class-transformer";

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
    @Post()
    async pay(@Body() body: PayRequest) {
        const result = this.paymentService.pay(body)

        return plainToInstance(PayResponse, result)
    }
}