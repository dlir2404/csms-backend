import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryRequest, EditCategoryRequest } from "./category.dto";
import { Category } from "src/database/models";

@Injectable()
export class CategoryService {
    async getListCategory() {
        const { count, rows } = await Category.findAndCountAll({raw: true})

        return {
            count,
            rows
        }
    }

    async createCategory(body: CreateCategoryRequest) {
        const category = Category.create({ name: body.name })

        return {result: true}
    }

    async updateCategory(id: number, body: EditCategoryRequest) {
        const category = await Category.findOne({ where: { id } })

        if (!category) throw new NotFoundException('Category not found!')

        await category.update({
            name: body.name,
        });

        return { result: true }
    }

    async deleteCategory(id: number) {
        const category = await Category.findOne({ where: { id } })

        if (!category) throw new NotFoundException('Category not found!')

        await Category.destroy({ where: {id}})

        return { result: true }
    }
}