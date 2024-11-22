import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateProductRequest, EditProductRequest, GetListProductRequest, ListProductResponse } from "./product.dto";
import { AuthRequired, ManagerAuth } from "src/shared/decorators/auth";
import { UserRole } from "src/shared/enums/user";
import { ProductService } from "./product.service";
import { plainToInstance } from "class-transformer";
import { BaseResponse } from "src/shared/types/base";

@Controller('product')
@ApiTags('Product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('all')
    @ApiResponse({
        type: ListProductResponse
    })
    @AuthRequired([UserRole.MANAGER, UserRole.BARISTA, UserRole.ORDER_TAKER])
    async getListProduct(@Query() query: GetListProductRequest) {
        const results = await this.productService.getListProduct(query);
        // return plainToInstance(ListProductResponse, results);
        return results;
    }

    @Post()
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    async createProduct(@Body() body: CreateProductRequest) {
        const results = await this.productService.createProduct(body);
        return plainToInstance(BaseResponse, results);
    }

    @Put(':id')
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    async editProduct(@Param('id') id: number, @Body() body: EditProductRequest) {
        const results = await this.productService.updateProduct(id, body);
        return plainToInstance(BaseResponse, results);
    }

    @Delete(':id')
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    async deleteCategory(@Param('id') id: number) {
        const results = await this.productService.deleteCategory(id);
        return plainToInstance(BaseResponse, results);
    }
}