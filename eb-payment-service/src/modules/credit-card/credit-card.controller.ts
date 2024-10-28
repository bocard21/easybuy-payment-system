import { Controller, Post, Patch, Body, Param } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';

@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Post('send')
  async create(@Body() data: any) {
    return this.creditCardService.create(data);
  }

  @Patch('update-status/:id')
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: boolean,
  ) {
    return this.creditCardService.updateTransactionStatus(id, status);
  }
}
