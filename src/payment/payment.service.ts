import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreatePaymentDto, PaymentResponse } from './dto';

export interface PaymentVerifyResult {
  approved: boolean;
  status: string;
  orderId: string | null;
}

@Injectable()
export class PaymentService {
  private readonly fedapayApiUrl = process.env['FEDAPAY_API_URL'] || 'https://api.fedapay.com';
  private readonly isProduction = process.env['NODE_ENV'] === 'production';

  private get fedapayApiKey(): string {
    return this.isProduction
      ? process.env['FEDAPAY_API_KEY_LIVE']!
      : process.env['FEDAPAY_API_KEY_TEST']!;
  }

  constructor(private readonly prisma: PrismaService) {
    const mode = this.isProduction ? 'PRODUCTION (clé live)' : 'TEST (clé sandbox)';
    console.log(`[PaymentService] Mode Fedapay : ${mode}`);
  }

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${this.fedapayApiUrl}/v1/transactions`,
        {
          description: createPaymentDto.description,
          amount: createPaymentDto.amount,
          currency: { iso: 'XOF' },
          callback_url: `${process.env['FRONTEND_URL'] || 'http://localhost:3000'}/payment/callback`,
          customer: {
            email: createPaymentDto.customerEmail,
            firstname: createPaymentDto.customerName.split(' ')[0] || createPaymentDto.customerName,
            lastname: createPaymentDto.customerName.split(' ').slice(1).join(' ') || '',
          },
          metadata: {
            orderId: createPaymentDto.orderId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.fedapayApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        id: response.data.id,
        url: response.data.transaction_url || response.data.url,
        status: response.data.status,
      };
    } catch (error: any) {
      const status = error?.response?.status;
      const fedapayMsg = error?.response?.data?.message ?? error?.response?.data ?? error?.message;
      console.error(`[Fedapay] createPayment failed — HTTP ${status}:`, fedapayMsg);
      throw new Error(`Erreur Fedapay (${status ?? 'réseau'}) : ${JSON.stringify(fedapayMsg)}`);
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerifyResult> {
    try {
      const response = await axios.get(
        `${this.fedapayApiUrl}/v1/transactions/${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.fedapayApiKey}`,
          },
        },
      );

      const transaction = response.data;
      const approved = transaction.status === 'approved';
      const orderId: string | null = transaction.metadata?.orderId ?? null;

      if (orderId) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: approved ? 'PAID' : 'FAILED',
            status: approved ? 'CONFIRMED' : undefined,
          },
        });
      }

      return { approved, status: transaction.status, orderId };
    } catch (error) {
      console.error('Fedapay verification error:', error);
      return { approved: false, status: 'error', orderId: null };
    }
  }

  async handleWebhook(payload: {
    type: string;
    data: { id: string; status: string; metadata?: { orderId?: string } };
  }): Promise<void> {
    const { type, data } = payload;
    const orderId = data?.metadata?.orderId;
    if (!orderId) return;

    const approved = type === 'transaction.approved' || data.status === 'approved';
    const failed =
      type === 'transaction.declined' ||
      type === 'transaction.cancelled' ||
      data.status === 'declined' ||
      data.status === 'cancelled';

    if (approved) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      });
    } else if (failed) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'FAILED' },
      });
    }
  }
}
