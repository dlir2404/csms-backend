import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductRequest, EditProductRequest, GetListProductRequest } from "./product.dto";
import { Category, Product } from "src/database/models";
import { Op, WhereOptions } from "sequelize";

@Injectable()
export class ProductService {
    async getListProduct(params: GetListProductRequest) {
        const where: WhereOptions<Product> = {}

        if (params.available !== undefined && params.available !== null) {
            where.available = params.available
        }

        if (params.from && params.to) {
            where.createdAt = {
                [Op.between]: [new Date(params.from), new Date(params.to)]
            };
        } else if (params.from) {
            where.createdAt = {
                [Op.gte]: new Date(params.from)
            };
        } else if (params.to) {
            where.createdAt = {
                [Op.lte]: new Date(params.to)
            };
        }

        if (params.search) {
            where.name = { [Op.like]: `%${params.search}%` }
        }

        const categoryWhere: WhereOptions<Category> = {}
        if (params.category) {
            categoryWhere.id = params.category
        }

        const { count, rows } = await Product.findAndCountAll({
            include: [{
                model: Category,
                as: 'categories',
                through: { attributes: [] },
                where: categoryWhere
            }],
            where: where,
            limit: params.pageSize || 10,
            subQuery: false,
            offset: ((params.page - 1 || 0) * (params.pageSize || 10)),
            distinct: true,
        });

        return {
            count,
            rows
        }
    }

    async createProduct(body: CreateProductRequest) {
        const existProduct = await Product.findOne({ where: { name: body.name } });

        if (existProduct) {
            throw new BadRequestException('Product exists')
        }

        const { categoryIds, ...rest } = body

        const product = await Product.create({ ...rest })

        if (categoryIds && categoryIds.length > 0) {
            const categories = await Category.findAll({
                where: {
                    id: categoryIds,
                },
            });

            if (categories.length === 0) {
                throw new NotFoundException('No categories found');
            }

            await product.$add('categories', categories);
        }

        return { result: true }
    }

    async updateProduct(id: number, body: EditProductRequest) {
        const existProduct = await Product.findOne({ where: { id } });

        if (!existProduct) throw new NotFoundException('Product not found')

        const { categoryIds, ...rest } = body

        await existProduct.update({
            ...rest
        })

        if (categoryIds && categoryIds.length > 0) {
            const categories = await Category.findAll({
                where: {
                    id: categoryIds,
                },
            });

            if (categories.length === 0) {
                throw new NotFoundException('No categories found');
            }

            await existProduct.$add('categories', categories);
        }

        return { result: true }
    }

    async deleteCategory(id: number) {
        const product = await Product.findOne({ where: { id } })

        if (!product) throw new NotFoundException('Product not found');

        await Product.destroy({ where: { id: id } })

        return { result: true }
    }
}