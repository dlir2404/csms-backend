import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { CreateOrderRequest, GetListOrderRequest, ListOrderResponse, UpdateStatusRequest } from "./order.dto";
import { AuthRequired, CurrentUserId, OrderTakerAuth } from "src/shared/decorators/auth";
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
        return plainToInstance(BaseResponse, result)
    }

    @Get('/all')
    @AuthRequired([UserRole.MANAGER, UserRole.BARISTA, UserRole.ORDER_TAKER])
    async getOrderList(@Query() query: GetListOrderRequest) {
        const result = await this.orderService.getOrderList(query)
        return plainToInstance(ListOrderResponse, result)
    }

    @Put('/status/:id')
    @AuthRequired([UserRole.BARISTA])
    async updateOrderStatus(@CurrentUserId() userId: number, @Body() body: UpdateStatusRequest, @Param('id') orderId: number) {
        const result = await this.orderService.updateStatus(userId, orderId, body)
        return plainToInstance(BaseResponse, result)
    }
}