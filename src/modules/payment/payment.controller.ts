import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
}