import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from './permissions.service';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get user from request (should be available after JWT auth)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has any of the required permissions
    const hasPermission = await this.checkUserPermissions(
      user.userId,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied. Required permissions: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }

  private async checkUserPermissions(
    userId: string,
    requiredPermissions: string[],
  ): Promise<boolean> {
    try {
      // Check if user has any of the required permissions
      for (const permission of requiredPermissions) {
        const hasPermission = await this.permissionsService.userHasPermission(
          userId,
          permission,
        );
        if (hasPermission) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking user permissions:', error);
      return false;
    }
  }
}

