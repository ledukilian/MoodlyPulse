import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  private readonly logger = new Logger(CsrfGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const cookieToken = request.cookies?.['XSRF-TOKEN'];
    // Angular HttpClient sends X-XSRF-TOKEN by default; keep legacy header as fallback.
    const headerValue =
      request.headers['x-xsrf-token'] ?? request.headers['x-csrf-token'];
    const headerToken =
      (Array.isArray(headerValue) ? headerValue[0] : headerValue) ??
      (typeof request.body === 'object' ? request.body?.csrfToken : undefined);

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      this.logger.warn('CSRF validation failed');
      throw new HttpException('Invalid CSRF token', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
