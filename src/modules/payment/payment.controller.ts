import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentService } from "./payment.service";
import { GetListPaymentRequest, OverviewResponse, PayRequest, PayResponse, VNPayIpnResultInterBank } from "./payment.dto";
import { plainToInstance } from "class-transformer";
import { GetDailyStatisticRequest, GetMonthlyStatisticRequest } from "../order/order.dto";

@Controller('/api/payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

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

    @Get('/all')
    async getListPayment(@Query() query: GetListPaymentRequest) {
        const result = this.paymentService.getListPayment(query)
        return result
    }

    @Get('/overview')
    async getPaymentOverview() {
        const result = this.paymentService.getPaymentOverview()
        return plainToInstance(OverviewResponse, result)
    }

    @Get('/statistic/day')
    async getDailyStatistic(@Query() query: GetDailyStatisticRequest) {
        return this.paymentService.sumValueByDay(query.month, query.year)
    }

    @Get('/statistic/month')
    async getMonthlyStatistic(@Query() query: GetMonthlyStatisticRequest) {
        return this.paymentService.sumValueByMonth(query.year)
    }
}