import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { RabbitMQService } from './rabbitmq.service';


@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, RabbitMQService],
})
export class AppModule {}
