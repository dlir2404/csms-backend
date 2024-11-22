import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { DateAndPaginationType } from "src/shared/types/base";

export class CreateCategoryRequest {
    @ApiProperty({
        type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}

export class EditCategoryRequest {
    @ApiProperty({
        type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}

@Expose()
export class CategoryResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;
}

@Expose()
export class ListCategoryResponse {
    @ApiProperty()
    count: number;

    @ApiProperty({
        type: CategoryResponse,
        isArray: true
    })
    @Type(() => CategoryResponse)
    rows: CategoryResponse[]
}