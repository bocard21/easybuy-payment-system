import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('create')
  async createTransaction(@Body() data: any) {
    return this.transactionService.createTransaction(data);
  }

  @Patch('confirm/:id')
  async confirmTransaction(@Param('id') id: number) {
    return this.transactionService.confirmTransaction(id);
  }
}
