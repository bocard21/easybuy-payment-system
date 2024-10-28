import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(data: any) {
    return this.prisma.transaction.create({
      data,
    });
  }

  async confirmTransaction(id: number) {
    return this.prisma.transaction.update({
      where: { id },
      data: { status: 'SUCCESS' },
    });
  }
}
