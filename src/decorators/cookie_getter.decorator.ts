import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const CookieGetter = createParamDecorator(
  (data: string, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    // console.log('Request Object:', request);
    // console.log('Cookies:', request.cookies);

    const refreshToken = request.cookies ? request.cookies[data] : null;
    console.log('Refresh Token:', refreshToken);

    if (!refreshToken) throw new UnauthorizedException('Token is not found');
    return refreshToken;
  },
);
