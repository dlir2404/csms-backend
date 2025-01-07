import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { AuthRequired, ManagerAuth } from "src/shared/decorators/auth";
import { CategoryResponse, CreateCategoryRequest, EditCategoryRequest, ListCategoryResponse } from "./category.dto";
import { plainToInstance } from "class-transformer";
import { BaseResponse } from "src/shared/types/base";
import { UserRole } from "src/shared/enums/user";

@Controller('category')
@ApiTags('Category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('all')
    @ApiResponse({
        type: ListCategoryResponse
    })
    @AuthRequired([UserRole.MANAGER, UserRole.BARISTA, UserRole.ORDER_TAKER])
    async getListCategory() {
        const results = await this.categoryService.getListCategory();
        return plainToInstance(ListCategoryResponse, results);
    }

    @Post()
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    async createcategory(@Body() body: CreateCategoryRequest) {
        const results = await this.categoryService.createCategory(body);
        return plainToInstance(BaseResponse, results);
    }

    @Put(':id')
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    async editCategory(@Param('id') id: number, @Body() body: EditCategoryRequest) {
        const results = await this.categoryService.updateCategory(id, body);
        return plainToInstance(BaseResponse, results);
    }

    @Delete(':id')
    @ApiResponse({
        type: BaseResponse
    })
    @ManagerAuth()
    async deleteCategory(@Param('id') id: number) {
        const results = await this.categoryService.deleteCategory(id);
        return plainToInstance(BaseResponse, results);
    }
}