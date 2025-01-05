import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCategoryRequest, EditCategoryRequest } from "./category.dto";
import { Category, Product, ProductCategory } from "src/database/models";
import { col, fn } from "sequelize";

@Injectable()
export class CategoryService {
    async getListCategory() {
        const { count, rows } = await Category.findAndCountAll({ raw: true })

        const productCount = await ProductCategory.findAll({
            attributes: [
                'categoryId',
                [fn('COUNT', col('*')), 'count'],
            ],
            group: ['categoryId'],
            raw: true
        }) as unknown as { categoryId: number, count: number }[]

        const rowsReturn = rows.map(r => {
            const count = productCount.find(prd => prd.categoryId === r.id)?.count || 0

            return {
                ...r,
                count
            }
        })

        return {
            count,
            rows: rowsReturn
        }
    }

    async createCategory(body: CreateCategoryRequest) {
        const category = Category.create({ name: body.name })

        return { result: true }
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

        await Category.destroy({ where: { id } })

        return { result: true }
    }
}