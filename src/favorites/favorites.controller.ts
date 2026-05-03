import { Controller, Get, Post, Delete, Param, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all favorites' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Favorites retrieved successfully' })
  getFavorites(@Headers('x-session-id') sessionId: string) {
    const id = sessionId || this.generateSessionId();
    return this.favoritesService.getFavorites(id);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add product to favorites' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 201, description: 'Product added to favorites successfully' })
  addToFavorites(@Headers('x-session-id') sessionId: string, @Param('productId') productId: string) {
    const id = sessionId || this.generateSessionId();
    return this.favoritesService.addToFavorites(id, productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove product from favorites' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 204, description: 'Product removed from favorites successfully' })
  removeFromFavorites(@Headers('x-session-id') sessionId: string, @Param('productId') productId: string) {
    const id = sessionId || this.generateSessionId();
    return this.favoritesService.removeFromFavorites(id, productId);
  }

  @Get(':productId/check')
  @ApiOperation({ summary: 'Check if product is in favorites' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Check result' })
  checkFavorite(@Headers('x-session-id') sessionId: string, @Param('productId') productId: string) {
    const id = sessionId || this.generateSessionId();
    return this.favoritesService.isFavorite(id, productId);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

