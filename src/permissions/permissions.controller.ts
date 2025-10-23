import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from './permissions.guard';
import { RequireModulePermission, Permissions } from './permissions.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  // Get all permissions - requires user_read permission
  @Get('list')
  @RequireModulePermission('user', 'read')
  async getAllPermissions() {
    return this.permissionsService.getAllPermissions();
  }

  // Get permissions by module - requires user_read permission
  @Get('module/:module')
  @RequireModulePermission('user', 'read')
  async getPermissionsByModule(@Param('module') module: string) {
    return this.permissionsService.getPermissionsByModule(module);
  }

  // Get user permissions - requires user_read permission
  @Get('user/:userId')
  @RequireModulePermission('user', 'read')
  async getUserPermissions(@Param('userId') userId: string) {
    return this.permissionsService.getUserPermissions(userId);
  }

  // Get user permissions by module - requires user_read permission
  @Get('user/:userId/module/:module')
  @RequireModulePermission('user', 'read')
  async getUserPermissionsByModule(
    @Param('userId') userId: string,
    @Param('module') module: string,
  ) {
    return this.permissionsService.getUserPermissionsByModule(userId, module);
  }

  // Create new permission - requires user_create permission
  @Post('create')
  @RequireModulePermission('user', 'create')
  async createPermission(
    @Body() permissionData: {
      permission_name: string;
      description?: string;
      module: string;
      action: string;
    },
  ) {
    return this.permissionsService.createPermission(permissionData);
  }

  // Assign permission to user - requires user_edit permission
  @Post('assign')
  @RequireModulePermission('user', 'edit')
  async assignPermissionToUser(
    @Body() body: { userId: string; permissionId: string },
  ) {
    return this.permissionsService.assignPermissionToUser(
      body.userId,
      body.permissionId,
    );
  }

  // Remove permission from user - requires user_edit permission
  @Delete('user/:userId/permission/:permissionId')
  @RequireModulePermission('user', 'edit')
  async removePermissionFromUser(
    @Param('userId') userId: string,
    @Param('permissionId') permissionId: string,
  ) {
    await this.permissionsService.removePermissionFromUser(userId, permissionId);
    return { message: 'Permission removed successfully' };
  }

  // Bulk assign permissions to user - requires user_edit permission
  @Post('bulk-assign')
  @RequireModulePermission('user', 'edit')
  async assignMultiplePermissionsToUser(
    @Body() body: { userId: string; permissionIds: string[] },
  ) {
    return this.permissionsService.assignMultiplePermissionsToUser(
      body.userId,
      body.permissionIds,
    );
  }

  // Get users with specific permission - requires user_read permission
  @Get('users/:permissionName')
  @RequireModulePermission('user', 'read')
  async getUsersWithPermission(@Param('permissionName') permissionName: string) {
    return this.permissionsService.getUsersWithPermission(permissionName);
  }

  // Check if user has specific permission - requires user_read permission
  @Get('check/:userId/:permissionName')
  @RequireModulePermission('user', 'read')
  async checkUserPermission(
    @Param('userId') userId: string,
    @Param('permissionName') permissionName: string,
  ) {
    const hasPermission = await this.permissionsService.userHasPermission(
      userId,
      permissionName,
    );
    return { hasPermission };
  }

  // Check if user has module permission - requires user_read permission
  @Get('check-module/:userId/:module/:action')
  @RequireModulePermission('user', 'read')
  async checkUserModulePermission(
    @Param('userId') userId: string,
    @Param('module') module: string,
    @Param('action') action: string,
  ) {
    const hasPermission = await this.permissionsService.userHasModulePermission(
      userId,
      module,
      action,
    );
    return { hasPermission };
  }
}

