import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderRequest, GetListOrderRequest, UpdateStatusRequest } from "./order.dto";
import { Order, OrderProduct, Product, User } from "src/database/models";
import { OrderStatus } from "src/shared/enums/order";
import { Op, WhereOptions } from "sequelize";

@Injectable()
export class OrderService {
    async createOrder(orderTakerId: number, body: CreateOrderRequest) {
        const newOrder = await Order.create(
            {
                totalPrice: body.totalPrice,
                note: body.note,
                createdById: orderTakerId,
                status: OrderStatus.CREATED
            },
        );

        const orderProducts = body.products.map((product) => ({
            orderId: newOrder.id,
            productId: product.productId,
            quantity: product.quantity,
        }));

        await OrderProduct.bulkCreate(orderProducts);

        return { result: true };
    }

    // order.service.ts
    async getOrderList(params: GetListOrderRequest) {
        const where: WhereOptions<Order> = {};

        if (params.status) {
            where.status = params.status;
        }

        if (params.from || params.to) {
            where.createdAt = {};
            if (params.from) {
                where.createdAt[Op.gte] = new Date(params.from);
            }
            if (params.to) {
                where.createdAt[Op.lte] = new Date(params.to);
            }
        }

        const page = params.page || 1;
        const pageSize = params.pageSize || 10;

        const { count, rows } = await Order.findAndCountAll({
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: {
                        attributes: ['quantity'],
                    },
                    attributes: ['id', 'name', 'price', 'thumbnail']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['id', 'username', 'fullName']
                },
                {
                    model: User,
                    as: 'processBy',
                    attributes: ['id', 'username', 'fullName']
                }
            ],
            where,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            distinct: true,
        });

        const transformedRows = rows.map(order => {
            const plainOrder = order.get({ plain: true });

            return {
                id: plainOrder.id,
                totalPrice: plainOrder.totalPrice,
                note: plainOrder.note,
                status: plainOrder.status,
                createdAt: plainOrder.createdAt,
                updatedAt: plainOrder.updatedAt,
                products: plainOrder.products.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    thumbnail: item.thumbnail,
                    quantity: item.OrderProduct.quantity
                })),
                createdBy: plainOrder.createdBy ? {
                    id: plainOrder.createdBy.id,
                    username: plainOrder.createdBy.username,
                    fullName: plainOrder.createdBy.fullName
                } : null,
                processBy: plainOrder.processBy ? {
                    id: plainOrder.processBy.id,
                    username: plainOrder.processBy.username,
                    fullName: plainOrder.processBy.fullName
                } : null
            };
        });

        return {
            count,
            rows: transformedRows,
        };
    }

    async updateStatus(userId: number, orderId: number, body: UpdateStatusRequest) {
        const order = await Order.findOne({ where: { id: orderId } })

        if (!order) throw new NotFoundException('Order not found')

        order.set({
            status: body.status
        })

        if (body.status === OrderStatus.PROCESSING) {
            order.set({
                processById: userId
            })
        }

        await order.save();

        return { result: true }
    }
}