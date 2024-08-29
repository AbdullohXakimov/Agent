import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { Observable } from 'rxjs';

@Injectable()
export class ClientGuard implements CanActivate {
  constructor(private readonly jwrService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('User is unauthorized');
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (bearer != 'Bearer' || !token)
      throw new UnauthorizedException('User is unauthorized');

    async function verify(token: string, jwrService: JwtService) {
      let user: any;
      try {
        user = await jwrService.verify(token, {
          secret: process.env.ACCESS_TOKEN_KEY,
        });
        if (user.hasOwnProperty('is_creator')) {
          return true;
        }
      } catch (error) {
        console.log(error);
        throw new UnauthorizedException('Invalid token cl');
      }

      if (!user) {
        throw new UnauthorizedException('Client is unauthorized');
      }

      if (!user.is_active) {
        throw new BadRequestException('Client is not active');
      }
      console.log('HAmmasi yaxshi22');
      req.client = user;
      return true;
    }
    return verify(token, this.jwrService);
  }
}
