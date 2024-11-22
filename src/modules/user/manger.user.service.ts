import { Injectable, NotFoundException } from "@nestjs/common";
import { EditUserRequest, GetListUsersRequest } from "./user.dto";
import { User } from "src/database/models";
import { Op, where, WhereOptions } from "sequelize";

@Injectable()
export class ManagerUserService {
    async getListUsers(params: GetListUsersRequest) {
        const where: WhereOptions<User> = {}

        if (params.role) {
            where.role = params.role
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

        const { rows, count } = await User.findAndCountAll({
            where: where,
            limit: params.pageSize || 10,
            offset: ((params.page - 1 || 0) * (params.pageSize || 10)),
            raw: true
        })

        return {
            count,
            rows
        }
    }

    async updateUser(id: number, body: EditUserRequest) {
        const user = await User.findOne({ where: {id: id}});

        if (!user) throw new NotFoundException('User not exists')

        await user.update({
            username: body.username,
            fullName: body.fullName,
            role: body.role,
        });

        return { result: true }
    }

    async deleteUser(id: number) {
        const user = await User.findOne({ where: {id: id}});

        if (!user) throw new NotFoundException('User not exists')

        return { result: true }
    }
}