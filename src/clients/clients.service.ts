import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from './entities/client.entity';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { LoginClientDto } from './dto/login-client.dto';
import { log } from 'console';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client) private clientRepo: typeof Client,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // Create a new client
  async create(createUserDto: CreateClientDto, res: Response) {
    const { email, password } = createUserDto;

    const existingUser = await this.clientRepo.findOne({
      where: { email },
    });
    log(email)

    if (existingUser) {
      throw new BadRequestException('The email is already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 7);

    const newUser = await this.clientRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const tokens = await this.getTokens(newUser);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    const activationLink = v4();
    console.log(activationLink);

    try {
      const new2 = await this.clientRepo.update(
        {
          refresh_token: hashedRefreshToken,
          activation_link: activationLink,
        },
        { where: { id: newUser.id }, returning: true },
      );
      console.log(new2[1][0]);

      res.cookie('refresh_token', tokens.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      await this.mailService.sendMailtoUser(new2[1][0]);

      const response = {
        message: 'User registered successfully',
        user: newUser,
        tokens,
      };

      return response;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to register user. Please try again later.',
      );
    }
  }

  async activate(link: string) {
    if (!link) throw new BadRequestException('Activation link not found');
    console.log(link);
    const updated = await this.clientRepo.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );
    if (!updated[1][0]) throw new BadRequestException('User already activated');
    const response = {
      message: 'ishladi 🙌🙌',
      user: updated[1][0].is_active,
    };
    return response;
  }

  // Retrieve all clients
  findAll() {
    return this.clientRepo.findAll();
  }

  // Retrieve a specific client by ID
  findOne(id: number) {
    return this.clientRepo.findByPk(id);
  }

  // Update a client's information
  async update(id: number, updateClientDto: UpdateClientDto) {
    const updatedClient = await this.clientRepo.update(updateClientDto, {
      where: { id },
      returning: true,
    });
    return updatedClient[1][0];
  }

  // Remove a client
  remove(id: number) {
    return this.clientRepo.destroy({ where: { id } });
  }

  // Generate access and refresh tokens for a client
  async getTokens(client: Client) {
    const payload = {
      id: client.id,
      is_active: client.is_active,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  // Handle client login
  async login(loginClientDto: LoginClientDto, res: Response) {
    const { email, password } = loginClientDto;

    const client = await this.clientRepo.findOne({ where: { email } });

    if (!client) throw new BadRequestException('Client not found');

    if (!client.is_active)
      throw new BadRequestException('Client is not active');

    const isMatch = await bcrypt.compare(password, client.password);

    if (!isMatch) throw new BadRequestException('Incorrect password');

    const tokens = await this.getTokens(client);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    const updatedClient = await this.clientRepo.update(
      {
        refresh_token: hashedRefreshToken,
        is_active: true,
      },
      { where: { id: client.id }, returning: true },
    );

    // Set the refresh token as a cookie in the response
    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // Return the logged-in client information along with tokens
    const response = {
      message: 'Client logged in',
      user: updatedClient[1][0],
      tokens,
    };
    return response;
  }

  async logOut(refreshToken: string, res: Response) {
    const clientData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!clientData) throw new ForbiddenException('Token not found');

    const updatedClient = await this.clientRepo.update(
      { refresh_token: null },
      { where: { id: clientData.id }, returning: true },
    );

    res.clearCookie('refresh_token');

    const response = {
      message: 'Client logged out successfully',
    };

    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);
    console.log(decodedToken);
    console.log(userId);

    if (!decodedToken || userId != decodedToken['id']) {
      throw new BadRequestException('Client not matched');
    }

    const client = await this.clientRepo.findByPk(userId);
    if (!client || !client.refresh_token) {
      throw new BadRequestException('Refresh token not found');
    }

    const isMatchedToken = await bcrypt.compare(
      refreshToken,
      client.refresh_token,
    );
    if (!isMatchedToken) {
      throw new ForbiddenException('Forbidden');
    }

    const tokens = await this.getTokens(client);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 7);
    await this.clientRepo.update(
      { refresh_token: hashedRefreshToken },
      { where: { id: client.id } },
    );

    res.cookie('refresh_token', tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return {
      message: 'User refreshed',
      tokens,
    };
  }
}
