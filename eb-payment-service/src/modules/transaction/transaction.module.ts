import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../../prisma.service'; 
@Module({
  imports: [
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
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService], 
})
export class TransactionModule {}
