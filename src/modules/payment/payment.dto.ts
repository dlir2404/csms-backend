import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentMethod } from "src/shared/enums/payment";
import { OrderResponse } from "../order/order.dto";
import { Type } from "class-transformer";

export class PayRequest {
    @ApiProperty()
    @IsNumber()
    @IsDefined()
    orderId: number;

    @ApiProperty()
    @IsNumber()
    @IsDefined()
    total: number;

    @ApiProperty({
        required: false
    })
    @IsNumber()
    @IsOptional()
    discount: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    paymentMethod: PaymentMethod
}

export class PayResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    paymentMethod: PaymentMethod

    @ApiProperty()
    status: string;

    @ApiProperty()
    @Type(() => OrderResponse)
    order: OrderResponse
}

export class PaymentWithoutOrderResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    paymentMethod: PaymentMethod

    @ApiProperty()
    status: string;
}