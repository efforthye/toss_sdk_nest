import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private readonly tossApiUrl: string;
  private readonly clientKey: string;
  private readonly secretKey: string;
  private readonly successUrl: string;
  private readonly failUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.tossApiUrl = this.configService.get<string>('TOSS_API_BASE_URL');
    this.clientKey = this.configService.get<string>('TOSS_CLIENT_KEY');
    this.secretKey = this.configService.get<string>('TOSS_SECRET_KEY');
    this.successUrl = this.configService.get<string>('SUCCESS_URL');
    this.failUrl = this.configService.get<string>('FAIL_URL');
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const orderId = uuidv4();

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.tossApiUrl}/v1/payments/checkout`,
          {
            amount: createPaymentDto.amount,
            orderId,
            orderName: createPaymentDto.orderName,
            customerName: createPaymentDto.customerName,
            customerEmail: createPaymentDto.customerEmail,
            successUrl: this.successUrl,
            failUrl: this.failUrl,
          },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(this.clientKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return {
        orderId,
        checkoutUrl: response.data.checkoutUrl,
        amount: createPaymentDto.amount,
      };
    } catch (error) {
      console.error('Toss API Error:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Payment creation failed',
      );
    }
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.tossApiUrl}/v1/payments/confirm`,
          {
            paymentKey: confirmPaymentDto.paymentKey,
            orderId: confirmPaymentDto.orderId,
            amount: confirmPaymentDto.amount,
          },
          {
            headers: {
              Authorization: `Basic ${Buffer.from(this.secretKey + ':').toString('base64')}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return {
        status: 'SUCCESS',
        paymentKey: response.data.paymentKey,
        orderId: response.data.orderId,
        amount: response.data.totalAmount,
        method: response.data.method,
        approvedAt: response.data.approvedAt,
        receipt: response.data.receipt,
      };
    } catch (error) {
      console.error('Payment confirmation error:', error.response?.data || error.message);
      throw new BadRequestException(
        error.response?.data?.message || 'Payment confirmation failed',
      );
    }
  }
}