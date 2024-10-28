import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  async processPayment(@Body() data: any) {
    // Inicia o processo de pagamento
    return this.paymentService.processPayment(data);
  }
}
