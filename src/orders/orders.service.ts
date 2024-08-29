import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDTO } from './dto/create-order.dto';
import { UpdateOrderStatusDTO } from './dto/update-order.dto';
import { Product } from '../products/entities/product.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderModel: typeof Order,
    @InjectModel(OrderItem) private orderItemModel: typeof OrderItem,
  ) {}

  // Create a new order
  async createOrder(
    clientId: number,
    createOrderDTO: CreateOrderDTO,
  ): Promise<Order> {
    console.log('KELDI');

    const { finished, totalPrice, orders } = createOrderDTO;

    // Create a new order
    const order = await this.orderModel.create({
      clientId,
      finished,
      totalPrice,
    });

    console.log('KEldi:', order);

    // Create order items
    for (const orderItem of orders) {
      await this.orderItemModel.create({
        ...orderItem,
        orderId: order.id,
      });
    }

    return order;
  }

  // Get all orders
  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product], // Include Product model here
          attributes: ['id', 'amount', 'total'], // Select specific attributes from OrderItem
        },
        Client
      ],
    });
  }

  // Get a single order by ID
  async getOrderById(id: number): Promise<Order> {
    const order = await this.orderModel.findOne({
      where: { id },
      include: [
        {
          model: OrderItem,
          include: [Product], // Include Product model here
          attributes: ['id', 'amount', 'total'], // Select specific attributes from OrderItem
        },
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  // Update an order
  async updateOrderStatus(
    id: number,
    updateOrderStatusDTO: UpdateOrderStatusDTO,
  ): Promise<Order> {
    const order = await this.getOrderById(id);
    order.finished = updateOrderStatusDTO.finished;
    return order.save();
  }

  // Delete an order
  async deleteOrder(id: number): Promise<void> {
    const order = await this.getOrderById(id);
    await this.orderModel.destroy({ where: { id: order.id } });
  }

  // Get orders by client ID
  async getOrdersByClientId(clientId: number): Promise<Order[]> {
    const data = await this.orderModel.findAll({
      where: { clientId },
      include: [
        {
          model: OrderItem,
          include: [Product], // Include Product model here
          attributes: ['id', 'amount', 'total'], // Select specific attributes from OrderItem
        },
        Client
      ],
    });
    console.log('Orders with products:', data);
    return data;
  }

  // Get unfinished orders
  async getUnfinishedOrders(): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { finished: false },
      include: [OrderItem],
    });
  }

  async getUnfinishedOrdersClient(clientId: number): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { finished: false, clientId: clientId },
      include: [OrderItem],
    });
  }

  // Get finished orders
  async getFinishedOrders(): Promise<Order[]> {
    return this.orderModel.findAll({
      where: { finished: true },
      include: [OrderItem],
    });
  }
}
