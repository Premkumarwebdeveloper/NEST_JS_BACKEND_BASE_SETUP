import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const verified = await this.authService.verifyToken(token);
      request['user'] = verified.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
