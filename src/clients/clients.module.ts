import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Client } from './entities/client.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { Admin } from '../admins/entities/admin.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [SequelizeModule.forFeature([Client]), JwtModule, MailModule, AdminsModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
