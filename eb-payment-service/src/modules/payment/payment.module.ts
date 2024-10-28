import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../prisma.service'; 
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService], // Adicionando PrismaService aos provedores
})
export class PaymentModule {}
