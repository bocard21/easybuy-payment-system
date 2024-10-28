import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private notificationClient: ClientProxy,
  ) {}

  async createTransaction(data: any) {
    const transaction = await this.prisma.transaction.create({
      data: {
        amount: data.amount,
        status: 'PENDING',
        userId: data.userId,
      },
    });

    // Notifica a criação da transação
    this.notificationClient.emit('transaction_created', {
      transactionId: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
    });

    return transaction;
  }

  async confirmTransaction(transactionId: number) {
    const updatedTransaction = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'SUCCESS' },
    });

    // Notifica a confirmação da transação
    this.notificationClient.emit('transaction_confirmed', {
      transactionId: updatedTransaction.id,
      userId: updatedTransaction.userId,
      amount: updatedTransaction.amount,
    });

    return updatedTransaction;
  }
}
