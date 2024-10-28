import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaService } from '../../prisma.service';
import { CreditCard, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class CreditCardService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATION_SERVICE') private rabbitClient: ClientProxy,
  ) {}

    async create(data: Prisma.CreditCardCreateInput): Promise<CreditCard> {
    const creditCard = await this.prisma.creditCard.create({ data });

        this.sendRegisterPaymentNotification(JSON.stringify(creditCard));

        this.processPayment(creditCard);

    return creditCard;
  }

    private async processPayment(payment: CreditCard) {
    setTimeout(() => {
      this.sendConfirmationPaymentNotification(JSON.stringify(payment));
    }, 10000); 
  }

    private sendRegisterPaymentNotification(message: string) {
    try {
      this.rabbitClient.emit('register', {
        id: randomUUID(),
        data: { notification: message },
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de registro:', error);
    }
  }

    private sendConfirmationPaymentNotification(message: string) {
    try {
      this.rabbitClient.emit('confirmation', {
        id: randomUUID(),
        data: { notification: message },
      });
    } catch (error) {
      console.error('Erro ao enviar notificação de confirmação:', error);
    }
  }

    async updateTransactionStatus(id: string, status: boolean): Promise<CreditCard> {
    return this.prisma.creditCard.update({
      where: { id },
      data: { paymentConfirmed: status },
    });
  }
}
