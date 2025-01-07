import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Order, Payment } from "src/database/models";
import { GetListPaymentRequest, PayRequest, VNPayIpnResponse, VNPayIpnResultInterBank } from "./payment.dto";
import { PaymentMethod, PaymentStatus } from "src/shared/enums/payment";
import { sortObject } from "src/shared/helpers/vnPay.fn";
import { ConfigService } from "@nestjs/config";
import { col, fn, Op, WhereOptions } from "sequelize";
import { getBeginOfDay, getBeginOfYesterday } from "src/shared/helpers/date";

@Injectable()
export class PaymentService {
    public constructor(
        private readonly configService: ConfigService
    ) { }

    async pay(body: PayRequest) {
        const order = await Order.findByPk(body.orderId)

        const payment = {
            subtotal: order.totalPrice,
            vat: order.totalPrice / 10,
            discount: body.discount || 0,
            total: body.total,
            paymentMethod: body.paymentMethod,
            status: PaymentStatus.COMPLETED,
            orderId: order.id
        }

        const createdPayment = await Payment.create(payment)

        return createdPayment
    }

    async updatePaymentResult(vnp_Params: VNPayIpnResultInterBank) {
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var secretKey = this.configService.get<string>('vnp_HashSecret');
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            var orderId = vnp_Params['vnp_TxnRef'];

            const order = await Order.findOne({ where: { id: orderId } })
            if (!order) {
                return new VNPayIpnResponse("01", "Order not found");
            }

            const payment = {
                subtotal: order.totalPrice,
                vat: order.totalPrice / 10,
                total: +vnp_Params['vnp_Amount'] / 100,
                discount: order.totalPrice * 1.1 - (+vnp_Params['vnp_Amount'] / 100),
                paymentMethod: PaymentMethod.VNPAY,
                orderId: order.id,
                status: PaymentStatus.PENDING
            }

            if (vnp_Params['vnp_ResponseCode'] !== "00") {
                payment.status = PaymentStatus.FAILED
            } else {
                payment.status = PaymentStatus.COMPLETED
            }

            await Payment.create(payment);
            return new VNPayIpnResponse("00", "Success");
        }
        else {
            return new VNPayIpnResponse("97", "Fail checksum")
        }
    }

    async getListPayment(params: GetListPaymentRequest) {
        const where: WhereOptions<Payment> = {};
        let order: any

        if (params.status) {
            where.status = params.status;
        }

        if (params.paymentMethod) {
            where.paymentMethod = params.paymentMethod;
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

        if (params.orderBy && params.order) {
            order = [[params.orderBy, params.order]]
        }

        const page = params.page || 1;
        const pageSize = params.pageSize || 10;

        const { count, rows } = await Payment.findAndCountAll({
            order,
            where,
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });

        return {
            count,
            rows
        }
    }

    async getPaymentOverview() {
        const beginOfDay = getBeginOfDay();
        const beginOfYesterday = getBeginOfYesterday();

        const todayOverview = await Payment.findOne({
            attributes: [
                [fn('SUM', col('total')), 'totalValue'],
                [fn('AVG', col('total')), 'avgValue'],
                [fn('SUM', col('vat')), 'totalVat'],
                [fn('SUM', col('discount')), 'totalDiscount']
            ],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true,
        })

        const yesterdayOverview = await Payment.findOne({
            attributes: [
                [fn('SUM', col('total')), 'totalValue'],
                [fn('AVG', col('total')), 'avgValue'],
                [fn('SUM', col('vat')), 'totalVat'],
                [fn('SUM', col('discount')), 'totalDiscount']
            ],
            where: {
                createdAt: {
                    [Op.gte]: beginOfYesterday,
                    [Op.lt]: beginOfDay
                },
            },
            raw: true,
        })

        const statusesRatio = await Payment.findAll({
            attributes: [
                'status',
                [fn('COUNT', col('*')), 'count']
            ],
            group: ['status'],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true
        })

        const methodRatio = await Payment.findAll({
            attributes: [
                'paymentMethod',
                [fn('COUNT', col('*')), 'count']
            ],
            group: ['paymentMethod'],
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            raw: true
        })

        const topPayments = await Payment.findAll({
            where: {
                createdAt: {
                    [Op.gte]: beginOfDay,
                },
            },
            limit: 5,
            order: [['total', 'desc']]
        })

        return {
            today: todayOverview,
            yesterday: yesterdayOverview,
            statuses: statusesRatio,
            methodRatio,
            topPayments
        }
    }

    async sumValueByDay(month: number, year: number) {
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
            const result = await Payment.findAll({
                attributes: [
                    [fn('DATE', col('createdAt')), 'day'],
                    [fn('SUM', col('total')), 'value'],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                group: [fn('DATE', col('createdAt'))],
                order: [[fn('DATE', col('createdAt')), 'ASC']],
                raw: true
            }) as any;

            const finalResult = days.map(day => {
                const value = result.find(res => res.day === day)?.value || 0
                return {
                    day: day,
                    value: value,
                }
            });

            return finalResult;
        } catch (error) {
            console.error('Error counting orders by day:', error);
            throw new InternalServerErrorException('Error when counting orders by day');
        }
    }

    async sumValueByMonth(year: number) {
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
            const result = await Payment.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'month'],
                    [fn('SUM', col('total')), 'value'],
                ],
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
                group: [fn('DATE_FORMAT', col('createdAt'), '%Y-%m')],
                order: [[fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'ASC']],
                raw: true
            }) as any;

            // Merge result with all months
            const finalResult = months.map(month => {
                const value = result.find(item => item.month === month)?.value || 0
                return {
                    month: month,
                    value: value
                }
            });

            return finalResult;
        } catch (error) {
            console.error('Error counting orders by month:', error);
            throw new InternalServerErrorException('Error when counting orders by month');
        }
    }
}