import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieGetter } from '../decorators/cookie_getter.decorator';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { LoginClientDto } from './dto/login-client.dto';
import { AdminGuard } from '../guards/admin-guards/admin.guard';
import { ClientGuard } from '../guards/client-guards/client.guard';
import { ClientSelfGuard } from '../guards/client-guards/client.self.guard';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // Retrieve all clients
  @ApiOperation({ summary: 'Retrieve all clients' })
  @ApiResponse({
    status: 200,
    description: 'List of clients retrieved successfully',
  })
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  // Retrieve a specific client by ID
  @ApiOperation({ summary: 'Retrieve a specific client by ID' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @UseGuards(ClientSelfGuard)
  @UseGuards(ClientGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }
  @UseGuards(AdminGuard)
  @Get('admin/:id')
  findOneForAdmin(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  // Update a client's information
  @ApiOperation({ summary: "Update a client's information" })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @UseGuards(ClientSelfGuard)
  @UseGuards(ClientGuard)
  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(+id, updateClientDto);
  }
  @UseGuards(AdminGuard)
  @Patch('admin:id')
  @HttpCode(200)
  updateForAdmin(
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(+id, updateClientDto);
  }

  // Remove a client
  @ApiOperation({ summary: 'Remove a client' })
  @ApiResponse({ status: 200, description: 'Client removed successfully' })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @UseGuards(ClientSelfGuard)
  @UseGuards(ClientGuard)
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
  @UseGuards(AdminGuard)
  @Delete('admin/:id')
  @HttpCode(200)
  removeForAdmin(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }

  // Sign up a new client
  @ApiOperation({ summary: 'Sign up a new client' })
  @ApiResponse({
    status: 201,
    description: 'The client has been successfully signed up',
  })
  @ApiOperation({ summary: 'Sign up a new client' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post('signup')
  @HttpCode(201)
  signUp(
    @Body() createClientDto: CreateClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.clientsService.create(createClientDto, res);
  }

  // Log in a client
  @ApiOperation({ summary: 'Log in a client' })
  @ApiResponse({ status: 200, description: 'Client logged in successfully' })
  @ApiBadRequestResponse({ description: 'Invalid login credentials' })
  @Post('login')
  @HttpCode(200)
  login(
    @Body() loginClientDto: LoginClientDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.clientsService.login(loginClientDto, res);
  }

  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.clientsService.activate(link);
  }

  // Log out a client
  @ApiOperation({ summary: 'Log out a client' })
  @ApiResponse({ status: 200, description: 'Client logged out successfully' })
  @ApiBadRequestResponse({ description: 'Invalid session' })
  @Post('logout')
  @HttpCode(200)
  logOut(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.clientsService.logOut(refreshToken, res);
  }

  @Post(':id/refresh')
  @ApiOperation({ summary: 'Refresh client token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  refreshToken(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.clientsService.refreshToken(id, refreshToken, res);
  }
}
