import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from './entities/admin.entity';

import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAdminDto } from './dto/login.admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin) private adminRepo: typeof Admin,
    private readonly jwtService: JwtService,
  ) {}

  // Retrieve all admins
  findAll() {
    return this.adminRepo.findAll();
  }

  // Retrieve a specific admin by ID
  findOne(id: number) {
    return this.adminRepo.findByPk(id);
  }

  // Update an admin's information
  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const updatedAdmin = await this.adminRepo.update(updateAdminDto, {
      where: { id },
      returning: true,
    });
    return updatedAdmin[1][0];
  }

  // Remove an admin
  async remove(id: number) {
    const deletet = await this.adminRepo.destroy({ where: { id } });
    if (deletet) return 'Admin deleted successfully';
    return 'There is no admin with this Id';
  }

  async create(createAdminDto: CreateAdminDto) {
    const admin = await this.adminRepo.findOne({
      where: { email: createAdminDto.email },
    });
    if (admin) {
      throw new BadRequestException('This email already in use');
    }
    const pass = await bcrypt.hash(createAdminDto.password, 7);
    console.log(pass);

    createAdminDto.password = pass;
    console.log(createAdminDto);

    return this.adminRepo.create(createAdminDto);
  }
  async login(loginAdminDto: LoginAdminDto, res: Response) {
    const { email, password } = loginAdminDto;
    const admin = await this.adminRepo.findOne({ where: { email } });

    if (!admin) throw new BadRequestException('Admin not found');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) throw new BadRequestException('Incorrect password');

    const tokens = await this.getTokens(admin);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    const updatedAdmin = await this.adminRepo.update(
      { refresh_token: hashedRefreshToken, is_active: true },
      { where: { id: admin.id }, returning: true },
    );

    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      httpOnly: true,
      secure: false, // false in development
      sameSite: 'lax', // Required for cross-origin requests
    });

    // Send tokens in the response body
    res.json({
      message: 'Admin logged in',
      admin: updatedAdmin[1][0],
      tokens, // This should include accessToken and refreshToken
    });
  }

  async logOut(refreshToken: string, res: Response) {
    console.log('ok');

    const adminData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
    });
    if (!adminData) throw new ForbiddenException('Token not found');

    const updatedAdmin = await this.adminRepo.update(
      { refresh_token: null },
      { where: { id: adminData.id }, returning: true },
    );

    res.clearCookie('refresh_token');

    const response = {
      message: 'Admin logged out successfully',
    };

    return response;
  }

  async refreshToken(refreshToken: string, res: Response) {
    console.log(refreshToken);

    const decodedToken = await this.jwtService.decode(refreshToken);
    console.log('Bu decoded token', decodedToken);

    if (!decodedToken) {
      throw new BadRequestException('Admin not matched');
    }

    const admin = await this.adminRepo.findByPk(decodedToken['id']);
    if (!admin || !admin.refresh_token) {
      throw new BadRequestException('Refresh token not found');
    }

    const isMatchedToken = await bcrypt.compare(
      refreshToken,
      admin.refresh_token,
    );
    if (!isMatchedToken) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getTokens(admin);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    await this.adminRepo.update(
      { refresh_token: hashedRefreshToken },
      { where: { id: admin.id } },
    );

    try {
      res.cookie('refresh_token', tokens.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      console.log('Nimadir wrong');
      return;
    }
    console.log('TOKENLAR:', tokens);

    return {
      message: 'Admin refreshed',
      tokens,
    };
  }

  // Generate access and refresh tokens for an admin
  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY_ADMIN,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY_ADMIN,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
