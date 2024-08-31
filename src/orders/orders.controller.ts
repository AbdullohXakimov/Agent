import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './orders.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { UpdateOrderStatusDTO } from './dto/update-order.dto';
import { ClientGuard } from '../guards/client-guards/client.guard';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../guards/admin-guards/admin.guard';
@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create a new order
  @UseGuards(ClientGuard)
  @Post()
  async createOrder(@Body() createOrderDTO: CreateOrderDTO, @Req() req: any) {
    console.log('oKA');
    const user = req.client;
    return this.orderService.createOrder(user.id, createOrderDTO);
  }

  // Get all orders
  @UseGuards(AdminGuard)
  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  // Get a single order by ID
  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  // Update an order
  @Patch(':id/finish')
  async updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDTO: UpdateOrderStatusDTO,
  ): Promise<Order> {
    console.log("Nima: ", updateOrderStatusDTO);
    
    return this.orderService.updateOrderStatus(id, updateOrderStatusDTO);
  }

  // Delete an order
  @Delete(':id')
  async deleteOrder(@Param('id') id: number): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  // Get orders by client ID
  @Get('admin/:clientId')
  async getOrdersByClientIdAdmin(
    @Param('clientId') clientId: number,
  ): Promise<Order[]> {
    return this.orderService.getOrdersByClientId(clientId);
  }
  @UseGuards(ClientGuard)
  @Get('client/my-orders')
  async getOrdersByClientId(@Req() req: any): Promise<Order[]> {
    const user = req.client;
    return this.orderService.getOrdersByClientId(user.id);
  }

  // Get unfinished orders
  @Get('status/unfinished')
  async getUnfinishedOrders(): Promise<Order[]> {
    return this.orderService.getUnfinishedOrders();
  }
  @UseGuards(ClientGuard)
  @Get('client/status/unfinished')
  async getUnfinishedOrdersClient(@Req() req: any): Promise<Order[]> {
    const user = req.client;
    return this.orderService.getUnfinishedOrdersClient(user.id);
  }

  @Get('confirm/:link')
  activate(@Param('link') link: string) {
    return this.orderService.activate(link);
  }

  // Get finished orders
  @Get('status/finished')
  async getFinishedOrders(): Promise<Order[]> {
    return this.orderService.getFinishedOrders();
  }
}
