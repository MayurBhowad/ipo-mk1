import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from './permission.model';
import { UserPermission } from './user-permission.model';
import { User } from '../users/user.model';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission)
    private permissionModel: typeof Permission,
    @InjectModel(UserPermission)
    private userPermissionModel: typeof UserPermission,
  ) {}

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionModel.findAll();
  }

  // Get permissions by module
  async getPermissionsByModule(module: string): Promise<Permission[]> {
    return this.permissionModel.findAll({
      where: { module },
    });
  }

  // Create a new permission
  async createPermission(permissionData: {
    permission_name: string;
    description?: string;
    module: string;
    action: string;
  }): Promise<Permission> {
    return this.permissionModel.create(permissionData);
  }

  // Assign permission to user
  async assignPermissionToUser(
    userId: string,
    permissionId: string,
  ): Promise<UserPermission> {
    // Check if permission already exists
    const existingPermission = await this.userPermissionModel.findOne({
      where: { user_id: userId, permission_id: permissionId },
    });

    if (existingPermission) {
      throw new Error('Permission already assigned to user');
    }

    return this.userPermissionModel.create({
      user_id: userId,
      permission_id: permissionId,
    });
  }

  // Remove permission from user
  async removePermissionFromUser(
    userId: string,
    permissionId: string,
  ): Promise<void> {
    await this.userPermissionModel.destroy({
      where: { user_id: userId, permission_id: permissionId },
    });
  }

  // Get user permissions
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userPermissions = await this.userPermissionModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Permission,
          as: 'permission',
        },
      ],
    });

    return userPermissions.map((up) => up.permission);
  }

  // Check if user has specific permission
  async userHasPermission(
    userId: string,
    permissionName: string,
  ): Promise<boolean> {
    const userPermissions = await this.userPermissionModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Permission,
          as: 'permission',
          where: { permission_name: permissionName },
        },
      ],
    });

    return userPermissions.length > 0;
  }

  // Check if user has permission for specific module and action
  async userHasModulePermission(
    userId: string,
    module: string,
    action: string,
  ): Promise<boolean> {
    const userPermissions = await this.userPermissionModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Permission,
          as: 'permission',
          where: { module, action },
        },
      ],
    });

    return userPermissions.length > 0;
  }

  // Get user permissions by module
  async getUserPermissionsByModule(
    userId: string,
    module: string,
  ): Promise<Permission[]> {
    const userPermissions = await this.userPermissionModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Permission,
          as: 'permission',
          where: { module },
        },
      ],
    });

    return userPermissions.map((up) => up.permission);
  }

  // Bulk assign permissions to user
  async assignMultiplePermissionsToUser(
    userId: string,
    permissionIds: string[],
  ): Promise<UserPermission[]> {
    const permissions = permissionIds.map((permissionId) => ({
      user_id: userId,
      permission_id: permissionId,
    }));

    return this.userPermissionModel.bulkCreate(permissions, {
      ignoreDuplicates: true,
    });
  }

  // Get all users with a specific permission
  async getUsersWithPermission(permissionName: string): Promise<User[]> {
    const userPermissions = await this.userPermissionModel.findAll({
      include: [
        {
          model: Permission,
          as: 'permission',
          where: { permission_name: permissionName },
        },
        {
          model: User,
          as: 'user',
        },
      ],
    });

    return userPermissions.map((up) => up.user);
  }
}

