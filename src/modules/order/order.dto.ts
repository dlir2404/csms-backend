import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "src/shared/enums/order";
import { UserRole } from "src/shared/enums/user";
import { DateAndPaginationType } from "src/shared/types/base";
import { UserResponse } from "../user/user.dto";

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
}

export class GetListOrderRequest extends DateAndPaginationType {
    @ApiProperty({
        enum: OrderStatus,
        required: false
    })
    @IsString()
    @IsOptional()
    status: OrderStatus
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