import { Exclude } from "class-transformer";
import { Model, Column, Table, DataType } from "sequelize-typescript";
import { UserRole } from "src/shared/enums/user";

@Table
export class User extends Model {
    @Column
    username: string

    @Column
    fullName: string

    @Column
    @Exclude()
    password: string

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
    })
    role: UserRole
}