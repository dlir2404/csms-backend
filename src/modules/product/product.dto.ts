import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDefined, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { DateAndPaginationType } from "src/shared/types/base";

export class CreateProductRequest {
    @ApiProperty({
        type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: Number
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        type: Boolean
    })
    @IsBoolean()
    @IsOptional()
    available: boolean;

    @ApiProperty({
        type: String
    })
    @IsString()
    @IsNotEmpty()
    thumbnail: string;

    @ApiProperty({
        type: [Number]
    })
    @IsArray()
    @IsOptional()
    categoryIds: number[];
}

export class EditProductRequest {
    @ApiProperty({
        type: String
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: Number
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        type: String
    })
    @IsString()
    thumbnail: string;

    @ApiProperty({
        type: Boolean
    })
    @IsBoolean()
    available: boolean;

    @ApiProperty({
        type: [Number]
    })
    @IsArray()
    @IsInt({ each: true })
    categoryIds: number[];
}

@Expose()
export class ProductResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    thumbnail: string;

    @ApiProperty()
    available: boolean;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;
}

export class GetListProductRequest extends DateAndPaginationType {
    @ApiProperty({
        type: Boolean,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    available: boolean

    @ApiProperty({
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    category: number

    @ApiProperty({
        required: false
    })
    @IsString()
    @IsOptional()
    search: string
}

@Expose()
export class ListProductResponse {
    @ApiProperty()
    count: number;

    @ApiProperty({
        type: ProductResponse,
        isArray: true
    })
    @Type(() => ProductResponse)
    rows: ProductResponse[]
}