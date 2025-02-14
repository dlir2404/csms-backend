import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateOrderRequest, GetCreatedByStatisticRequest, GetListOrderRequest, GetProcessedByStatisticRequest, UpdateStatusRequest } from "./order.dto";
import { Order, OrderProduct, Payment, Product, User } from "src/database/models";
import { OrderStatus } from "src/shared/enums/order";
import { col, fn, Op, Sequelize, WhereOptions } from "sequelize";
import { getBeginOfDay, getBeginOfYesterday } from "src/shared/helpers/date";

@Injectable()
export class OrderService {
    async getOverview() {
        const beginOfDay = getBeginOfDay();
        const beginOfYesterday = getBeginOfYesterday();

        const todayOverview = await Order.findOne({
            attributes: [
                [fn('COUNT', col('*')), 'totalOrders'],
                [fn('SUM', col('totalPrice')), 'totalOrderValue'],
                [fn('AVG', col('totalPrice')), 'avgOrderValue']
            ],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true,
        }) as unknown as {
            totalOrders: number;
            totalOrderValue: number;
            avgOrderValue: number;
        };

        const yesterdayOverview = await Order.findOne({
            attributes: [
                [fn('COUNT', col('*')), 'totalOrders'],
                [fn('SUM', col('totalPrice')), 'totalOrderValue'],
                [fn('AVG', col('totalPrice')), 'avgOrderValue']
            ],
            where: {
                createdAt: {
                    [Op.gte]: beginOfYesterday,
                    [Op.lt]: beginOfDay
                },
            },
            raw: true,
        }) as unknown as {
            totalOrders: number;
            totalOrderValue: number;
            avgOrderValue: number;
        };

        const itemToday = await OrderProduct.sum('quantity', {
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
        })

        const itemYesterday = await OrderProduct.sum('quantity', {
            where: {
                createdAt: {
                    [Op.gte]: beginOfYesterday,
                    [Op.lt]: beginOfDay
                },
            },
        })

        const orderStatus = await Order.findAll({
            attributes: [
                "status",
                [fn('COUNT', col('*')), 'count'],
            ],
            group: ['status'],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true
        }) as unknown as OrderCountResult[]

        const statuses = Object.values(OrderStatus).map((status) => ({
            status,
            count: 0,
        }));

        orderStatus.forEach((item) => {
            const index = statuses.findIndex((r) => r.status === item.status);
            if (index > -1) {
                statuses[index].count = Number(item?.count);
            }
        });

        const createdByRaw = await Order.findAll({
            attributes: [
                "createdById",
                [fn('COUNT', col('*')), 'order'],
                [fn('SUM', col('totalPrice')), 'totalValue']
            ],
            include: [{
                model: User,
                attributes: ['id', 'username', 'fullName'],
                as: 'createdBy'
            }],
            group: ['createdById'],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true
        }) as unknown as OrderCreatedByResult[]

        const createdBy = createdByRaw.map(record => ({
            createdById: record.createdById,
            count: record.order,
            totalValue: +record.totalValue,
            username: record['createdBy.username'],
            fullName: record['createdBy.fullName'],
        }));

        const processByRaw = await Order.findAll({
            attributes: [
                "processById",
                [fn('COUNT', col('*')), 'order'],
                [fn('SUM', col('totalPrice')), 'totalValue']
            ],
            include: [{
                model: User,
                attributes: ['id', 'username', 'fullName'],
                as: 'processBy'
            }],
            group: ['processById'],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true
        }) as unknown as OrderProcessByResult[]

        const processBy = processByRaw
            .filter(item => item.processById !== null)
            .map(record => ({
                processById: record.processById,
                count: record.order,
                totalValue: +record.totalValue,
                username: record['processBy.username'],
                fullName: record['processBy.fullName'],
            }));


        const productRatioRaw = await OrderProduct.findAll({
            attributes: [
                "productId",
                [fn('COUNT', col('*')), 'count'],
            ],
            include: [{
                model: Product,
                attributes: ['id', 'name'],
            }],
            group: ['productId'],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true
        }) as unknown as ProductRatioResult[]

        const productRatio = productRatioRaw.map(record => ({
            id: record.productId,
            count: record.count,
            name: record['product.name'],
        }));

        return {
            today: {
                totalOrders: todayOverview.totalOrders || 0,
                totalOrderValue: +todayOverview.totalOrderValue || 0,
                avgOrderValue: +todayOverview.avgOrderValue || 0,
                totalItems: itemToday || 0
            },
            yesterday: {
                totalOrders: yesterdayOverview.totalOrders || 0,
                totalOrderValue: +yesterdayOverview.totalOrderValue || 0,
                avgOrderValue: +yesterdayOverview.avgOrderValue || 0,
                totalItems: itemYesterday || 0
            },
            statuses,
            createdBy,
            processBy,
            productRatio
        }
    }

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
            note: product.note
        }));

        await OrderProduct.bulkCreate(orderProducts);

        return newOrder.dataValues;
    }

    // order.service.ts
    async getOrderList(params: GetListOrderRequest) {
        const where: WhereOptions<Order> = {};
        let order: any

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

        if (params.createdBy) {
            where.createdById = params.createdBy
        }

        if (params.processBy) {
            where.processById = params.processBy
        }

        if (params.orderBy && params.order) {
            order = [[params.orderBy, params.order]]
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
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: ['id', 'subtotal', 'vat', 'discount', 'total', 'paymentMethod', 'status', 'createdAt']
                }
            ],
            order,
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
                } : null,
                payment: plainOrder.payment ? {
                    id: plainOrder.payment.id,
                    subtotal: plainOrder.payment.subtotal,
                    vat: plainOrder.payment.vat,
                    discount: plainOrder.payment.discount,
                    total: plainOrder.payment.total,
                    paymentMethod: plainOrder.payment.paymentMethod,
                    status: plainOrder.payment.status
                } : null
            };
        });

        return {
            count,
            rows: transformedRows,
        };
    }

    async getOrder(orderId: number) {
        const order = await Order.findOne({
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: {
                        attributes: ['quantity', 'note'],
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
                },
                {
                    model: Payment,
                    as: 'payment',
                    attributes: ['id', 'subtotal', 'vat', 'discount', 'total', 'paymentMethod', 'status', 'createdAt']
                }
            ],
            where: { id: orderId },
        });

        if (!order) throw new NotFoundException('Order not found')

        const transformedRows = [order].map(order => {
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
                    quantity: item.OrderProduct.quantity,
                    note: item.OrderProduct.note
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
                } : null,
                payment: plainOrder.payment ? {
                    id: plainOrder.payment.id,
                    subtotal: plainOrder.payment.subtotal,
                    vat: plainOrder.payment.vat,
                    discount: plainOrder.payment.discount,
                    total: plainOrder.payment.total,
                    paymentMethod: plainOrder.payment.paymentMethod,
                    status: plainOrder.payment.status
                } : null
            };
        });

        return transformedRows[0];
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

    async countOrdersByDay(month: number, year: number) {
        try {
            // Calculate the total number of days in the given month
            const daysInMonth = new Date(year, month, 0).getDate();

            // Generate all days of the month in "YYYY-MM-DD" format
            const days = Array.from({ length: daysInMonth }, (_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                return `${year}-${month.toString().padStart(2, '0')}-${day}`;
            });

            // Start and end dates for the query
            const startDate = new Date(year, month - 1, 1); // First day of the month
            const endDate = new Date(year, month, 0);      // Last day of the month

            // Query to get order counts by day
            const result = await Order.findAll({
                attributes: [
                    [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'day'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))],
                order: [[Sequelize.fn('DATE', Sequelize.col('createdAt')), 'ASC']],
            });

            // Convert query result to an object for easy lookup
            const resultMap = result.reduce((map, item) => {
                map[item.dataValues.day] = parseInt(item.dataValues.count, 10);
                return map;
            }, {});

            // Merge query results with all days
            const finalResult = days.map(day => ({
                day: day,
                count: resultMap[day] || 0,
            }));

            return finalResult;
        } catch (error) {
            console.error('Error counting orders by day:', error);
            throw new InternalServerErrorException('Error when counting orders by day');
        }
    }

    async countOrdersByMonth(year: number) {
        try {
            // Generate all months of the year in "YYYY-MM" format
            const months = Array.from({ length: 12 }, (_, i) => {
                const month = (i + 1).toString().padStart(2, '0');
                return `${year}-${month}`;
            });

            // Start and end dates of the year
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year + 1, 0, 0);

            // Query to get order counts by month
            const result = await Order.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'month'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
                order: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'ASC']],
            });

            // Convert query result to an object for easy lookup
            const resultMap = result.reduce((map, item) => {
                map[item.dataValues.month] = parseInt(item.dataValues.count, 10);
                return map;
            }, {});

            // Merge result with all months
            const finalResult = months.map(month => ({
                month: month,
                count: resultMap[month] || 0,
            }));

            return finalResult;
        } catch (error) {
            console.error('Error counting orders by month:', error);
            throw new InternalServerErrorException('Error when counting orders by month');
        }
    }

    async getCreatedByStatistic(month: number, year: number) {
        try {
            // Create date range for the specified month
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
    
            const result = await Order.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'day'],
                    [fn('COUNT', col('Order.id')), 'count'],
                ],
                include: [{
                    model: User,
                    as: 'createdBy',
                    attributes: ['id', 'username', 'fullName'],
                }],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [
                    'createdBy.id',
                    fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'day'
                ],
                order: [
                    // ['createdBy.id', 'ASC'],
                    [fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'ASC']
                ],
                raw: true,
                nest: true
            });

            const userMap = new Map();
    
            const daysInMonth = endDate.getDate();
            const allDays = Array.from({ length: daysInMonth }, (_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                return `${year}-${month.toString().padStart(2, '0')}-${day}`;
            });
    
            result.forEach((row: any) => {
                if (!userMap.has(row.createdBy.id)) {
                    userMap.set(row.createdBy.id, {
                        id: row.createdBy.id,
                        name: row.createdBy.fullName || row.createdBy.username,
                        data: allDays.map(day => ({
                            day,
                            count: 0
                        }))
                    });
                }
            });
    
            // Fill in the actual counts
            result.forEach((row: any) => {
                const userData = userMap.get(row.createdBy.id);
                const dayIndex = userData.data.findIndex(d => d.day === row.day);
                
                if (dayIndex !== -1) {
                    userData.data[dayIndex].count = parseInt(row.count, 10);
                }
            });
    
            // Convert Map to Array for final result
            const finalResult = Array.from(userMap.values());
    
            return finalResult;
        } catch (error) {
            console.error('Error getting user order statistics:', error);
            throw new InternalServerErrorException('Error when retrieving user order statistics');
        }
    }

    async getProcessedByStatistic(month: number, year: number) {
        try {
            // Create date range for the specified month
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
    
            const result = await Order.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'day'],
                    [fn('COUNT', col('Order.id')), 'count'],
                ],
                include: [{
                    model: User,
                    as: 'processBy',
                    attributes: ['id', 'username', 'fullName'],
                }],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [
                    'processBy.id',
                    fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'day'
                ],
                order: [
                    // ['processBy.id', 'ASC'],
                    [fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'ASC']
                ],
                raw: true,
                nest: true
            });

            const userMap = new Map();
    
            const daysInMonth = endDate.getDate();
            const allDays = Array.from({ length: daysInMonth }, (_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                return `${year}-${month.toString().padStart(2, '0')}-${day}`;
            });
    
            result.forEach((row: any) => {
                if (!row.processBy.id)  return;
                if (!userMap.has(row.processBy.id)) {
                    userMap.set(row.processBy.id, {
                        id: row.processBy.id,
                        name: row.processBy.fullName || row.processBy.username,
                        data: allDays.map(day => ({
                            day,
                            count: 0
                        }))
                    });
                }
            });
    
            // Fill in the actual counts
            result.forEach((row: any) => {
                if (!row.processBy.id)  return;
                const userData = userMap.get(row.processBy.id);
                const dayIndex = userData.data.findIndex(d => d.day === row.day);
                
                if (dayIndex !== -1) {
                    userData.data[dayIndex].count = parseInt(row.count, 10);
                }
            });
    
            // Convert Map to Array for final result
            const finalResult = Array.from(userMap.values());
    
            return finalResult;
        } catch (error) {
            console.error('Error getting user order statistics:', error);
            throw new InternalServerErrorException('Error when retrieving user order statistics');
        }
    }

    async getStatisticByProduct(month: number, year: number) {
        try {
            // Create date range for the specified month
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
    
            const result = await Order.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'day'],
                    [fn('COUNT', col('Order.id')), 'count'],
                ],
                include: [
                    {
                        model: Product,
                        as: 'products',
                        through: {
                            attributes: [],
                        },
                        attributes: ['id', 'name']
                    },
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [
                    'products.id',
                    fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'day'
                ],
                order: [
                    // ['products.id', 'ASC'],
                    [fn('DATE_FORMAT', col('Order.createdAt'), '%Y-%m-%d'), 'ASC']
                ],
                raw: true,
                nest: true
            });

            const productMap = new Map();
    
            const daysInMonth = endDate.getDate();
            const allDays = Array.from({ length: daysInMonth }, (_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                return `${year}-${month.toString().padStart(2, '0')}-${day}`;
            });
    
            result.forEach((row: any) => {
                if (!row.products.id)  return;
                if (!productMap.has(row.products.id)) {
                    productMap.set(row.products.id, {
                        id: row.products.id,
                        name: row.products.name,
                        data: allDays.map(day => ({
                            day,
                            count: 0
                        }))
                    });
                }
            });
    
            // Fill in the actual counts
            result.forEach((row: any) => {
                if (!row.products.id)  return;
                const userData = productMap.get(row.products.id);
                const dayIndex = userData.data.findIndex(d => d.day === row.day);
                
                if (dayIndex !== -1) {
                    userData.data[dayIndex].count = parseInt(row.count, 10);
                }
            });
    
            // Convert Map to Array for final result
            const finalResult = Array.from(productMap.values());
    
            return finalResult;
        } catch (error) {
            console.error('Error getting user order statistics:', error);
            throw new InternalServerErrorException('Error when retrieving user order statistics');
        }
    }

    async getStatisticQuantityByProduct(month: number, year: number) {
        try {
            // Create date range for the specified month
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);
    
            const result = await OrderProduct.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('OrderProduct.createdAt'), '%Y-%m-%d'), 'day'],
                    [fn('SUM', col('quantity')), 'count'],
                ],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name']
                    },
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                group: [
                    'productId',
                    fn('DATE_FORMAT', col('OrderProduct.createdAt'), '%Y-%m-%d'), 'day'
                ],
                order: [
                    [fn('DATE_FORMAT', col('OrderProduct.createdAt'), '%Y-%m-%d'), 'ASC']
                ],
                raw: true,
                nest: true
            });

            const productMap = new Map();
    
            const daysInMonth = endDate.getDate();
            const allDays = Array.from({ length: daysInMonth }, (_, i) => {
                const day = (i + 1).toString().padStart(2, '0');
                return `${year}-${month.toString().padStart(2, '0')}-${day}`;
            });
    
            result.forEach((row: any) => {
                if (!row.product.id)  return;
                if (!productMap.has(row.product.id)) {
                    productMap.set(row.product.id, {
                        id: row.product.id,
                        name: row.product.name,
                        data: allDays.map(day => ({
                            day,
                            count: 0
                        }))
                    });
                }
            });
    
            // Fill in the actual counts
            result.forEach((row: any) => {
                if (!row.product.id)  return;
                const userData = productMap.get(row.product.id);
                const dayIndex = userData.data.findIndex(d => d.day === row.day);
                
                if (dayIndex !== -1) {
                    userData.data[dayIndex].count = parseInt(row.count, 10);
                }
            });
    
            // Convert Map to Array for final result
            const finalResult = Array.from(productMap.values());
    
            return finalResult;
        } catch (error) {
            console.error('Error getting user order statistics:', error);
            throw new InternalServerErrorException('Error when retrieving user order statistics');
        }
    }
}