import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get cart items' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  getCart(@Headers('x-session-id') sessionId: string) {
    const id = sessionId || this.generateSessionId();
    return this.cartService.getCart(id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  addToCart(@Headers('x-session-id') sessionId: string, @Body() addToCartDto: AddToCartDto) {
    const id = sessionId || this.generateSessionId();
    return this.cartService.addToCart(id, addToCartDto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  updateCartItem(
    @Headers('x-session-id') sessionId: string,
    @Param('id') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    const id = sessionId || this.generateSessionId();
    return this.cartService.updateCartItem(id, itemId, updateDto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 204, description: 'Item removed from cart successfully' })
  removeFromCart(@Headers('x-session-id') sessionId: string, @Param('id') itemId: string) {
    const id = sessionId || this.generateSessionId();
    return this.cartService.removeFromCart(id, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  clearCart(@Headers('x-session-id') sessionId: string) {
    const id = sessionId || this.generateSessionId();
    return this.cartService.clearCart(id);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

