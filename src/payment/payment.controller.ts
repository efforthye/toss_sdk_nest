import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create payment' })
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const result = await this.paymentService.createPayment(createPaymentDto);
    return result;
  }

  @Post('confirm')
  @ApiOperation({ summary: 'Confirm payment' })
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    const result = await this.paymentService.confirmPayment(confirmPaymentDto);
    return result;
  }

  @Get('success')
  @ApiOperation({ summary: 'Payment success callback' })
  async paymentSuccess(
    @Query('paymentKey') paymentKey: string,
    @Query('orderId') orderId: string,
    @Query('amount') amount: string,
    @Res() res: Response,
  ) {
    try {
      // Auto-confirm payment on success
      const result = await this.paymentService.confirmPayment({
        paymentKey,
        orderId,
        amount: parseInt(amount),
      });

      // Redirect to Flutter app with success parameters
      const redirectUrl = `${process.env.FRONTEND_URL}/payment/success?paymentKey=${paymentKey}&orderId=${orderId}&amount=${amount}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Payment confirmation error:', error);
      const errorUrl = `${process.env.FRONTEND_URL}/payment/fail?code=CONFIRM_ERROR&message=Payment confirmation failed`;
      return res.redirect(errorUrl);
    }
  }

  @Get('fail')
  @ApiOperation({ summary: 'Payment failure callback' })
  async paymentFail(
    @Query('code') code: string,
    @Query('message') message: string,
    @Res() res: Response,
  ) {
    // Redirect to Flutter app with error parameters
    const redirectUrl = `${process.env.FRONTEND_URL}/payment/fail?code=${code}&message=${encodeURIComponent(message)}`;
    return res.redirect(redirectUrl);
  }
}