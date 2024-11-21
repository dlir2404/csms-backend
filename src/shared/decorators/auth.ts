import { applyDecorators, BadRequestException, createParamDecorator, ExecutionContext, SetMetadata, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserRole } from "../enums/user";
import { ManagerGuard } from "src/modules/auth/guards/manager";
import { OrderTakerGuard } from "src/modules/auth/guards/order_taker";
import { BaristaGuard } from "src/modules/auth/guards/barista";
import { RolesGuard } from "src/modules/auth/guards/role";

export const User = createParamDecorator(
    async (data: any, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const auth = request.user;
        return data ? auth?.[data] : auth;
    },
);

export const CurrentUserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const userId = request.user?.sub || request.user?.id;
        if (!userId) {
            throw new BadRequestException('Missing user in the request');
        }
        return userId;
    },
);

export function ManagerAuth() {
    return applyDecorators(
        UseGuards(ManagerGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function OrderTakerAuth() {
    return applyDecorators(
        UseGuards(OrderTakerAuth),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function BaristaAuth() {
    return applyDecorators(
        UseGuards(BaristaGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}

export function AuthRequired(roles?: UserRole[]) {
    if (roles && roles.length > 0) {
        return applyDecorators(
            SetMetadata('roles', roles),
            UseGuards(RolesGuard),
            ApiBearerAuth(),
            // ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY),
            ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        );
    }
    return applyDecorators(
        // UseGuards(AuthGuard),
        ApiBearerAuth(),
        // ApiBearerAuth(SWAGGER_ACCESS_TOKEN_KEY),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}