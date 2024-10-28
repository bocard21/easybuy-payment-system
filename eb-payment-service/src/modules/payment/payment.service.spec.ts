import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private notificationClient: ClientProxy,
  ) {}

  async processPayment(data: any) {
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: data.amount,
        status: 'PENDING',
        userId: data.userId,
      },
    });

    this.notificationClient.emit('transaction_pending', {
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
    });

    return transaction;
  }

  async confirmPayment(transactionId: number) {
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'SUCCESS' },
    });

    this.notificationClient.emit('transaction_confirmed', {
      transactionId: updatedTransaction.id,
      userId: updatedTransaction.userId,
      amount: updatedTransaction.amount,
    });

    return updatedTransaction;
  }
}
