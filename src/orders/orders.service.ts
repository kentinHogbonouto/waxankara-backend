import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateOrderDto } from './dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(sessionId: string, createOrderDto: CreateOrderDto, userId?: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Le panier est vide');
    }

    const subtotal = cart.items.reduce(
      (sum: number, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const tax = subtotal * 0.2; // 20% TVA
    const shipping = createOrderDto.shipping || 0;
    const total = subtotal + tax + shipping;

    // Create order first
    const order = await this.prisma.order.create({
      data: {
        sessionId,
        userId,
        subtotal,
        tax,
        shipping,
        total,
        customerEmail: createOrderDto.customerEmail,
        customerName: createOrderDto.customerName,
        customerPhone: createOrderDto.customerPhone,
        shippingAddress: createOrderDto.shippingAddress,
      },
    });

    // Create order items
    await this.prisma.orderItem.createMany({
      data: cart.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color,
      })),
    });

    // Fetch order with items
    const orderWithItems = await this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Initiate payment
    const payment = await this.paymentService.createPayment({
      amount: Number(total),
      description: `Commande ${order.id}`,
      customerEmail: createOrderDto.customerEmail,
      customerName: createOrderDto.customerName,
      orderId: order.id,
    });

    // Update order with payment info
    await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: payment.id,
        paymentMethod: 'fedapay',
      },
    });

    // Clear cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    if (!orderWithItems) {
      throw new InternalServerErrorException('Erreur lors de la création de la commande');
    }

    return {
      ...orderWithItems,
      paymentUrl: payment.url,
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) throw new NotFoundException(`Commande ${id} introuvable`);
    return order;
  }

  async updatePaymentStatus(orderId: string, paymentStatus: 'PAID' | 'FAILED') {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException(`Commande ${orderId} introuvable`);

    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        status: paymentStatus === 'PAID' ? 'CONFIRMED' : order.status,
      },
    });
  }

  async findBySession(sessionId: string, userId?: string) {
    return this.prisma.order.findMany({
      where: userId ? { userId } : { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

