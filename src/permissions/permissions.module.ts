import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionsService } from './permissions.service';
import { PermissionsGuard } from './permissions.guard';
import { PermissionsController } from './permissions.controller';
import { Permission } from './permission.model';
import { UserPermission } from './user-permission.model';
import { User } from '../users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Permission, UserPermission, User])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsGuard],
  exports: [PermissionsService, PermissionsGuard],
})
export class PermissionsModule {}
