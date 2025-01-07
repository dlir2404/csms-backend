import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderRequest, GetCreatedByStatisticRequest, GetDailyStatisticRequest, GetListOrderRequest, GetMonthlyStatisticRequest, GetOrderRequest, GetProcessedByStatisticRequest, ListOrderResponse, OrderResponse, OverviewResponse, UpdateStatusRequest } from "./order.dto";
import { AuthRequired, CurrentUserId, ManagerAuth, OrderTakerAuth } from "src/shared/decorators/auth";
import { UserRole } from "src/shared/enums/user";
import { plainToInstance } from "class-transformer";
import { BaseResponse } from "src/shared/types/base";

@Controller('order')
@ApiTags('Order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post('')
    @OrderTakerAuth()
    async createOrder(@Body() body: CreateOrderRequest, @CurrentUserId() userId: number) {
        const result = await this.orderService.createOrder(userId, body)
        return plainToInstance(OrderResponse, result)
    }

    @Get('/overview')
    // @ManagerAuth()
    @ApiResponse({
        type: OverviewResponse
    })
    async getOrderOverview() {
        const result = await this.orderService.getOverview()
        return plainToInstance(OverviewResponse, result)
    }

    @Get('/all')
    @AuthRequired([UserRole.MANAGER, UserRole.BARISTA, UserRole.ORDER_TAKER])
    async getOrderList(@Query() query: GetListOrderRequest) {
        const result = await this.orderService.getOrderList(query)
        return plainToInstance(ListOrderResponse, result)
    }

    @Get(':id')
    @AuthRequired([UserRole.MANAGER, UserRole.BARISTA, UserRole.ORDER_TAKER])
    async getOrder(@Param() request: GetOrderRequest) {
        const result = await this.orderService.getOrder(request.id)
        return plainToInstance(OrderResponse, result)
    }

    @Put('/status/:id')
    @AuthRequired([UserRole.BARISTA])
    async updateOrderStatus(@CurrentUserId() userId: number, @Body() body: UpdateStatusRequest, @Param('id') orderId: number) {
        const result = await this.orderService.updateStatus(userId, orderId, body)
        return plainToInstance(BaseResponse, result)
    }

    @Get('/statistic/day')
    async getDailyStatistic(@Query() query: GetDailyStatisticRequest) {
        return this.orderService.countOrdersByDay(query.month, query.year)
    }

    @Get('/statistic/month')
    async getMonthlyStatistic(@Query() query: GetMonthlyStatisticRequest) {
        return this.orderService.countOrdersByMonth(query.year)
    }

    @Get('/statistic/created-by')
    async getCreatedByStatistic(@Query() query: GetCreatedByStatisticRequest) {
        return await this.orderService.getCreatedByStatistic(query)
    }

    @Get('/statistic/processed-by')
    async getProcessedByStatistic(@Query() query: GetProcessedByStatisticRequest) {
        return await this.orderService.getProcessedByStatistic(query)
    }
}