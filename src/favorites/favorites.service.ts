import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addToFavorites(sessionId: string, productId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: {
        sessionId_productId: {
          sessionId,
          productId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.favorite.create({
      data: {
        sessionId,
        productId,
      },
      include: {
        product: true,
      },
    });
  }

  async removeFromFavorites(sessionId: string, productId: string) {
    await this.prisma.favorite.deleteMany({
      where: {
        sessionId,
        productId,
      },
    });
  }

  async getFavorites(sessionId: string) {
    return this.prisma.favorite.findMany({
      where: { sessionId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async isFavorite(sessionId: string, productId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        sessionId_productId: {
          sessionId,
          productId,
        },
      },
    });

    return !!favorite;
  }
}

