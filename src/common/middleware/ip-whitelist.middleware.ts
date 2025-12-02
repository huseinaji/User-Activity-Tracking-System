import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class IpWhitelistMiddleware implements NestMiddleware {
  private whitelistedIp: string[];
  constructor() {
    this.whitelistedIp = JSON.parse(process.env.WHITELISTED_IP!);;
  }
  use(req: any, res: any, next: () => void) {
    //Reverse Proxy, Load Balancer, cloud provider
    let clientIp =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      req.ip;

    if (clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim();
    }
    console.log('Client IP:', clientIp);

    if (!this.whitelistedIp.some(ip => clientIp.includes(ip))) {
      throw new ForbiddenException('You are not allowed to access this resource');
    }

    next();
  }
}
