import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorator to specify required permissions for a route
 * @param permissions - Array of permission names required to access the route
 * 
 * @example
 * @Permissions('ipo_read')
 * @Get('list')
 * async getIpoList() { ... }
 * 
 * @example
 * @Permissions('ipo_create', 'ipo_edit')
 * @Post('create')
 * async createIpo() { ... }
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Decorator to specify required module and action permissions
 * @param module - The module name (e.g., 'ipo', 'inward', 'corporate')
 * @param action - The action name (e.g., 'read', 'create', 'edit', 'delete')
 * 
 * @example
 * @RequireModulePermission('ipo', 'read')
 * @Get('list')
 * async getIpoList() { ... }
 */
export const RequireModulePermission = (module: string, action: string) =>
  SetMetadata(PERMISSIONS_KEY, [`${module}_${action}`]);

/**
 * Decorator to specify multiple module permissions
 * @param module - The module name
 * @param actions - Array of action names
 * 
 * @example
 * @RequireModulePermissions('ipo', ['read', 'create'])
 * @Post('create')
 * async createIpo() { ... }
 */
export const RequireModulePermissions = (module: string, actions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, actions.map(action => `${module}_${action}`));

