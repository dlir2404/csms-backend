import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentMethod, PaymentStatus } from "src/shared/enums/payment";
import { OrderResponse } from "../order/order.dto";
import { Type } from "class-transformer";
import { DateAndPaginationType } from "src/shared/types/base";

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

export class VNPayIpnResultInterBank {
    @ApiProperty()
    vnp_TmnCode: string;

    @ApiProperty()
    vnp_Amount: string;

    @ApiProperty()
    vnp_BankCode: string;

    @ApiProperty()
    vnp_BankTranNo: string;

    @ApiProperty()
    vnp_CardType: string;

    @ApiProperty()
    vnp_PayDate: string;

    @ApiProperty()
    vnp_OrderInfo: string;

    @ApiProperty()
    vnp_TransactionNo: string;

    @ApiProperty()
    vnp_ResponseCode: string;

    @ApiProperty()
    vnp_TransactionStatus: string;

    @ApiProperty()
    vnp_TxnRef: string;

    @ApiProperty()
    vnp_SecureHashType: string;

    @ApiProperty()
    vnp_SecureHash: string;
}

export class VNPayIpnResponse {
    RspCode: string;
    Message: string;

    constructor(RspCode: string, Message: string) {
        this.RspCode = RspCode;
        this.Message = Message;
    }
}

export class GetListPaymentRequest extends DateAndPaginationType {
    @ApiProperty({
        enum: PaymentStatus,
        required: false
    })
    @IsString()
    @IsOptional()
    status: PaymentStatus

    @ApiProperty({
        enum: PaymentMethod,
        required: false
    })
    @IsString()
    @IsOptional()
    paymentMethod: PaymentMethod

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