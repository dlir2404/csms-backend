import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "src/shared/enums/order";
import { UserRole } from "src/shared/enums/user";
import { DateAndPaginationType, DateType } from "src/shared/types/base";
import { UserResponse } from "../user/user.dto";
import { PaymentWithoutOrderResponse } from "../payment/payment.dto";

export class OrderProduct {
    @ApiProperty({
        type: Number
    })
    @IsNumber()
    @IsDefined()
    productId: number;

    @ApiProperty({
        type: Number
    })
    @IsNumber()
    @IsDefined()
    quantity: number;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    note: string;
}

export class CreateOrderRequest {
    @ApiProperty({
        type: Number
    })
    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @ApiProperty({
        type: String
    })
    @IsString()
    @IsOptional()
    note: string;

    @ApiProperty({
        type: [OrderProduct]
    })
    @IsArray()
    products: OrderProduct[];
}

export class UpdateStatusRequest {
    @ApiProperty({
        enum: OrderStatus
    })
    @IsString()
    status: OrderStatus;
}

@Expose()
export class OrderResponse {
    @ApiProperty()
    id: number

    @ApiProperty()
    totalPrice: number;

    @ApiProperty()
    note: string;

    @ApiProperty()
    status: OrderStatus;

    @ApiProperty()
    createdById: number;

    @ApiProperty()
    @Type(() => UserResponse)
    createdBy: UserResponse;

    @ApiProperty()
    @Type(() => UserResponse)
    processById: UserResponse;

    @ApiProperty()
    @Type(() => UserResponse)
    processBy: UserResponse;

    @ApiProperty()
    createdAt: string

    @ApiProperty()
    updatedAt: string

    @ApiProperty()
    @Type(() => PaymentWithoutOrderResponse)
    payment: PaymentWithoutOrderResponse
}

export class GetListOrderRequest extends DateAndPaginationType {
    @ApiProperty({
        enum: OrderStatus,
        required: false
    })
    @IsString()
    @IsOptional()
    status: OrderStatus

    @ApiProperty({
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    createdBy: number

    @ApiProperty({
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    processBy: number

    @ApiProperty({
        required: false
    })
    @IsString()
    @IsOptional()
    orderBy: string

    @ApiProperty({
        required: false
    })
    @IsString()
    @IsOptional()
    order: string
}

@Expose()
export class ListOrderResponse {
    @ApiProperty()
    count: number;

    @ApiProperty({
        type: OrderResponse,
        isArray: true
    })
    @Type(() => OrderResponse)
    rows: OrderResponse[]
}


// export class OrderProductDTO {
//     id: number;
//     name: string;
//     price: number;
//     thumbnail: string;
//     quantity: number;
// }

// export class OrderDTO {
//     id: number;
//     totalPrice: number;
//     note: string;
//     status: OrderStatus;
//     createdAt: Date;
//     updatedAt: Date;
//     products: OrderProductDTO[];
// }

export class ProductInOrderDTO {
    product: {
        id: number;
        name: string;
        price: number;
        thumbnail: string;
    };
    quantity: number;
}

export class OrderDTO {
    id: number;
    totalPrice: number;
    note: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
    products: ProductInOrderDTO[];
    createdBy: UserResponse;
    processBy: UserResponse;
}

export class GetDailyStatisticRequest {
    @ApiProperty()
    @IsNumber()
    @IsDefined()
    @Type(() => Number)
    month: number;

    @ApiProperty()
    @IsNumber()
    @IsDefined()
    @Type(() => Number)
    year: number;
}

export class GetMonthlyStatisticRequest {
    @ApiProperty()
    @IsNumber()
    @IsDefined()
    @Type(() => Number)
    year: number;
}

export class GetCreatedByStatisticRequest extends DateType {

}

export class GetProcessedByStatisticRequest extends DateType {

}

export class OverviewReport {
    @ApiProperty()
    totalOrder: number;

    @ApiProperty()
    totalOrderValue: number;

    @ApiProperty()
    avgOrderValue: number;

    @ApiProperty()
    totalItems: number;
}

export class OverViewStatus {
    @ApiProperty()
    status: string;

    @ApiProperty()
    count: number;
}

export class OverviewResponse {
    @ApiProperty({
        type: OverviewReport,
        isArray: true
    })
    @Type(() => OverviewReport)
    today: OverviewReport;

    @ApiProperty({
        type: OverviewReport,
        isArray: true
    })
    @Type(() => OverviewReport)
    yesterday: OverviewReport;

    @ApiProperty({
        type: OverViewStatus,
        isArray: true
    })
    @Type(() => OverViewStatus)
    statuses: OverViewStatus[]
}

export class GetOrderRequest {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    id: number
}