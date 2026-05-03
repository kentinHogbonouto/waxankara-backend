import { Controller, Get, Post, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  create(
    @Headers('x-session-id') sessionId: string,
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() user: { id: string } | null,
  ) {
    const id = sessionId || this.generateSessionId();
    return this.ordersService.create(id, createOrderDto, user?.id);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders by session or user' })
  @ApiHeader({ name: 'x-session-id', required: false, description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  findBySession(
    @Headers('x-session-id') sessionId: string,
    @CurrentUser() user: { id: string } | null,
  ) {
    const id = sessionId || this.generateSessionId();
    return this.ordersService.findBySession(id, user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
