import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { CsrfGuard } from './csrf/csrf.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  /**
   * Proxy demo route that hides the Go backend behind the BFF.
   */
  @Get('api/demo/proxy')
  async proxyDemo(@Req() request: Request) {
    const authorizationHeader = request.headers['authorization'] as string | undefined;
    return this.appService.proxyDemo(authorizationHeader);
  }

  /**
   * Generates a CSRF token, stores it in an HTTP-only cookie and returns it for demo purposes.
   */
  @Get('csrf/token')
  issueCsrfToken(@Res({ passthrough: true }) response: Response) {
    const csrfToken = this.appService.generateCsrfToken();
    response.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return { csrfToken };
  }

  /**
   * Route protected by the CsrfGuard to demonstrate server-side token validation.
   */
  @Post('demo/csrf')
  @HttpCode(200)
  @UseGuards(CsrfGuard)
  verifyCsrf() {
    return {
      message: 'CSRF OK',
      receivedAt: new Date().toISOString(),
    };
  }

  /**
   * Forces an error to showcase the global HTTP exception filter.
   */
  @Get('demo/error')
  demoError() {
    throw new Error('Demo error triggered intentionally');
  }
}
