import { Controller, Post, Body, Get, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get('verify/:transactionId')
  @ApiOperation({ summary: 'Verify payment and update order status' })
  @ApiResponse({ status: 200, description: '{ approved, status, orderId }' })
  verify(@Param('transactionId') transactionId: string) {
    return this.paymentService.verifyPayment(transactionId);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Fedapay webhook' })
  @ApiResponse({ status: 200 })
  webhook(@Body() payload: any) {
    return this.paymentService.handleWebhook(payload);
  }
}
