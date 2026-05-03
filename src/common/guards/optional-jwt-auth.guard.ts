import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // Ne lève pas d'erreur si pas de token — retourne null à la place
  override handleRequest(_err: any, user: any) {
    return user ?? null;
  }
}
