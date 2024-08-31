import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../products/entities/product.entity';
import { ClientProduct } from './entities/client_product.entity';
import { Client } from '../clients/entities/client.entity';
import { CreateClientProductDto } from './dto/create-client_product.dto';
import { UpdateClientProductDto } from './dto/update-client_product.dto';
import { log } from 'console';

@Injectable()
export class ClientProductsService {
  constructor(
    @InjectModel(ClientProduct)
    private readonly clientProductModel: typeof ClientProduct,
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    @InjectModel(Client)
    private readonly clientModel: typeof Client,
  ) {}

  async create(
    createClientProductDto: CreateClientProductDto,
    user: { clientId: number; isAdmin: boolean }, // User object passed
  ): Promise<ClientProduct> {
    const { clientId, productId, amount } = createClientProductDto;

    // Check if both clientId and productId exist
    const client = await this.clientModel.findByPk(clientId);
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const product = await this.productModel.findByPk(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Ensure the amount is positive
    if (amount <= 0) {
      throw new BadRequestException(
        'The amount must be greater than zero when creating a new client-product relationship.',
      );
    }

    // Check if there is enough amount in stock
    if (product.amount < amount) {
      throw new BadRequestException(
        'Not enough stock available for the product',
      );
    }

    // Check for existing ClientProduct entry with the same clientId and productId
    const existingClientProduct = await this.clientProductModel.findOne({
      where: { clientId, productId },
    });

    if (existingClientProduct) {
      throw new ConflictException(
        'ClientProduct with this clientId and productId already exists',
      );
    }

    // Subtract the ordered amount from the product's stock
    product.amount -= amount;

    // Save the updated product stock
    await product.save();

    // Create the new client-product relationship
    return this.clientProductModel.create(createClientProductDto);
  }

  async findOne(user: { id: number }): Promise<ClientProduct[]> {
    console.log('UserID:', user);

    const clientProduct = await this.clientProductModel.findAll({
      where: { clientId: user.id },
      include: { all: true },
    });
    console.log(clientProduct);

    if (!clientProduct) {
      throw new NotFoundException(`ClientProduct with ID ${user.id} not found`);
    }

    // Ensure that the requesting client is the owner of the clientProduct or an admin

    return clientProduct;
  }

  async findOneAdmin(id: number): Promise<ClientProduct[]> {
    console.log(id);

    const clientProduct = await this.clientProductModel.findAll({
      where: { clientId: id },
    });
    return clientProduct;
  }

  async update(
    id: number,
    updateClientProductDto: UpdateClientProductDto,
    user: { id: number },
  ): Promise<ClientProduct> {
    const clientProduct = await this.clientProductModel.findByPk(id);
    if (!clientProduct) {
      throw new NotFoundException(`ClientProduct with ID ${id} not found`);
    }
    if (clientProduct.clientId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to update this product.',
      );
    }

    // Reduce the client's product amount without affecting the base stock
    if (clientProduct.amount < updateClientProductDto.amount)
      throw new BadRequestException("You should order to add product")
    if (updateClientProductDto.amount >= 0)
    clientProduct.amount = updateClientProductDto.amount;
  else throw new BadRequestException("Amount can't be less than 0")

    await clientProduct.save();
    console.log(clientProduct.amount);

    return clientProduct;
  }

  async remove(id: number): Promise<void> {
    const clientProduct = await this.clientProductModel.findByPk(id);
    if (!clientProduct) {
      throw new NotFoundException(`ClientProduct with ID ${id} not found`);
    }
    await clientProduct.destroy();
  }
}
