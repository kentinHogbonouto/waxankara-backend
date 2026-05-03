import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(sessionId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addToCart(sessionId: string, addToCartDto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException('Produit introuvable');
    }

    const requestedQty = addToCartDto.quantity || 1;

    const cart = await this.getOrCreateCart(sessionId);

    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: addToCartDto.productId,
        size: addToCartDto.size || null,
        color: addToCartDto.color || null,
      },
    });

    const totalQty = (existingItem?.quantity ?? 0) + requestedQty;

    if (product.stock !== null && product.stock < totalQty) {
      throw new BadRequestException(
        product.stock === 0
          ? 'Ce produit est en rupture de stock'
          : `Stock insuffisant — seulement ${product.stock} disponible(s)`,
      );
    }

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: totalQty },
        include: { product: true },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: addToCartDto.productId,
        quantity: requestedQty,
        size: addToCartDto.size,
        color: addToCartDto.color,
      },
      include: { product: true },
    });
  }

  async updateCartItem(sessionId: string, itemId: string, updateDto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
      include: { product: true },
    });

    if (!item) {
      throw new NotFoundException('Article introuvable dans le panier');
    }

    if (updateDto.quantity !== undefined) {
      const { stock } = item.product;
      if (stock !== null && stock < updateDto.quantity) {
        throw new BadRequestException(
          stock === 0
            ? 'Ce produit est en rupture de stock'
            : `Stock insuffisant — seulement ${stock} disponible(s)`,
        );
      }
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: updateDto,
      include: { product: true },
    });
  }

  async removeFromCart(sessionId: string, itemId: string) {
    const cart = await this.getOrCreateCart(sessionId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Article introuvable dans le panier');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(sessionId: string) {
    const cart = await this.getOrCreateCart(sessionId);
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  async getCart(sessionId: string) {
    return this.getOrCreateCart(sessionId);
  }
}

