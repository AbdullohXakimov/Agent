import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientProductsService } from './client_products.service';
import { CreateClientProductDto } from './dto/create-client_product.dto';
import { UpdateClientProductDto } from './dto/update-client_product.dto';
import { AdminGuard } from '../guards/admin-guards/admin.guard';
import { ClientGuard } from '../guards/client-guards/client.guard';
import { log } from 'console';

@Controller('client-products')
export class ClientProductsController {
  constructor(private readonly clientProductsService: ClientProductsService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(
    @Body() createClientProductDto: CreateClientProductDto,
    @Req() req: any,
  ) {
    console.log('Nima gap');

    log(createClientProductDto);
    const user = req.client; // Extract client data from request
    return this.clientProductsService.create(createClientProductDto, user);
  }

  @UseGuards(ClientGuard)
  @Get('shopProducts')
  findOne(@Req() req: any) {
    const user = req.client;
    return this.clientProductsService.findOne( user);
  }
  @UseGuards(AdminGuard)
  @Get('admins/:id')
  findOneAdmin(@Param('id') id: string, @Req() req: any) {
    console.log(id);
    return this.clientProductsService.findOneAdmin(+id);
  }

  @UseGuards(ClientGuard)
  @Patch(":id")
  update(
    @Param('id') id: string,
    @Body() updateClientProductDto: UpdateClientProductDto,
    @Req() req: any,
  ) {
    const user = req.client;
    return this.clientProductsService.update(+id, updateClientProductDto, user);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.clientProductsService.remove(+id);
  }
}
