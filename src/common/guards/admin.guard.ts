import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const adminKey = process.env['ADMIN_API_KEY'];

    if (!adminKey) {
      throw new UnauthorizedException('ADMIN_API_KEY non configurée');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-admin-key'];

    if (!provided || provided !== adminKey) {
      throw new UnauthorizedException('Clé admin invalide ou manquante');
    }

    return true;
  }
}
