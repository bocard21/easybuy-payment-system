import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello, Notification Service!';
  }

 
  processNotification(message: string): string {
    
    return `Notification sent: ${message}`;
  }
}
