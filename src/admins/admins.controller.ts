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
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LoginAdminDto } from './dto/login.admin.dto';
import { CookieGetter } from '../decorators/cookie_getter.decorator';
import { Response } from 'express';
import { AdminCreatorGuard } from '../guards/admin-guards/admin.creator.guard';
import { AdminGuard } from '../guards/admin-guards/admin.guard';
import { AdminSelfGuard } from '../guards/admin-guards/admin.self.guard';

@ApiTags('Admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  // Retrieve all admins
  @ApiOperation({ summary: 'Retrieve all admins' })
  @ApiResponse({
    status: 200,
    description: 'List of admins retrieved successfully',
  })
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.adminsService.findAll();
  }

  @Get('set-test-cookie')
  setTestCookie(@Res() res: Response) {
    console.log('setcoookieee');

    res.cookie('test_cookie', 'test_value', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });
    res.send('Test cookie set');
  }

  // Retrieve a specific admin by ID
  @ApiOperation({ summary: 'Retrieve a specific admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @UseGuards(AdminSelfGuard)
  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Retrieve a specific admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @UseGuards(AdminGuard)
  @Get('creator/:id')
  findOneforCreator(@Param('id') id: string) {
    return this.adminsService.findOne(+id);
  }

  // Update an admin's information
  @ApiOperation({ summary: "Update an admin's information" })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @UseGuards(AdminSelfGuard)
  @UseGuards(AdminGuard)
  @Patch(':id')
  @HttpCode(200)
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  @ApiOperation({ summary: "Update an admin's information" })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @UseGuards(AdminGuard)
  @Patch('creator/:id')
  @HttpCode(200)
  updateForCreator(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.update(+id, updateAdminDto);
  }

  // Remove an admin
  @ApiOperation({ summary: 'Remove an admin' })
  @ApiResponse({ status: 200, description: 'Admin removed successfully' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id);
  }

  // Create a new admin
  @ApiOperation({ summary: 'Create a new admin' })
  @ApiResponse({
    status: 201,
    description: 'The admin has been successfully created',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  // @UseGuards(AdminGuard)
  @Post()
  @HttpCode(201)
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  // Log in an admin
  @ApiOperation({ summary: 'Log in an admin' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully' })
  @ApiBadRequestResponse({ description: 'Invalid login credentials' })
  @Post('login')
  @HttpCode(200)
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Call the service method to handle login
    return this.adminsService.login(loginAdminDto, res);
  }

  // Log out an admin
  @ApiOperation({ summary: 'Log out an admin' })
  @ApiResponse({ status: 200, description: 'Admin logged out successfully' })
  @ApiBadRequestResponse({ description: 'Invalid session' })
  @Post('logout')
  @HttpCode(200)
  logOut(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Call the service method to handle logout
    return this.adminsService.logOut(refreshToken, res);
  }

  // Refresh an admin's token
  @ApiOperation({ summary: 'Refresh admin token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @Post('refresh')
  refreshToken(
    @CookieGetter('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(refreshToken, 'controller');

    return this.adminsService.refreshToken(refreshToken, res);
  }
}
