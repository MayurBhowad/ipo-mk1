import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { IpoController } from './ipo.controller';
import { IpoService } from './ipo.service';
import { IpoApplication } from './ipo.model';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    SequelizeModule.forFeature([IpoApplication]),
    PermissionsModule,
  ],
  controllers: [IpoController],
  providers: [IpoService],
  exports: [IpoService],
})
export class IpoModule {}

