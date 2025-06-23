import { IsNotEmpty, IsNumber, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Payment amount', example: 15000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Order name', example: '토스 티셔츠' })
  @IsNotEmpty()
  @IsString()
  orderName: string;

  @ApiProperty({ description: 'Customer name', example: '김토스' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer email', example: 'customer@example.com' })
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;
}