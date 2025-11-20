import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { getConfig, ServerConfig } from './config';

@Injectable()
export class AppService {
  private readonly config: ServerConfig = getConfig();

  getHealth() {
    return {
      status: 'ok',
      tech: 'nest',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Simple proxy towards the Go backend in order to keep the URL hidden from the frontend.
   */
  async proxyDemo(authorizationHeader?: string) {
    const targetUrl = `${this.config.backendGoUrl.replace(/\/$/, '')}/private/demo`;

    try {
      const response = await axios.get(targetUrl, {
        headers: authorizationHeader
          ? {
              Authorization: authorizationHeader,
            }
          : undefined,
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Upstream backend is unavailable',
        HttpStatus.BAD_GATEWAY,
        { cause: error instanceof Error ? error : undefined },
      );
    }
  }

  generateCsrfToken(): string {
    // In a real system this could be signed with CSRF_SECRET.
    return randomBytes(32).toString('hex');
  }
}
