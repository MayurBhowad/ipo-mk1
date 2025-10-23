# Permission-Based API Access Control System

This document describes the implementation of a comprehensive permission-based access control system for the NestJS backend application.

## Overview

The permission system provides granular control over API access by allowing administrators to assign specific permissions to users. Each user can access only the APIs corresponding to their assigned permissions.

## System Architecture

### Core Components

1. **Permission Model** - Defines individual permissions
2. **UserPermission Model** - Links users to their permissions
3. **Permissions Service** - Manages permission operations
4. **Permissions Guard** - Enforces permission checks
5. **Permission Decorators** - Simplifies permission declaration on routes

### Database Schema

#### Permissions Table
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  permission_name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  module VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### User Permissions Table
```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, permission_id)
);
```

## Permission Structure

### Module-Based Permissions

Permissions follow the pattern: `{module}_{action}`

#### Available Modules
- **ipo** - IPO applications management
- **inward** - Inward applications management  
- **corporate** - Corporate applications management
- **user** - User management

#### Available Actions
- **read** - View/list data
- **create** - Create new records
- **edit** - Update existing records
- **delete** - Remove records

### Example Permissions
- `ipo_read` - Can view IPO applications
- `ipo_create` - Can create new IPO applications
- `ipo_edit` - Can update IPO applications
- `ipo_delete` - Can delete IPO applications
- `inward_read` - Can view inward applications
- `user_create` - Can create new users

## Implementation Details

### 1. Permission Decorators

#### RequireModulePermission
```typescript
@RequireModulePermission('ipo', 'read')
@Get('list')
async getIpoList() { ... }
```

#### Permissions (Multiple Options)
```typescript
@Permissions('ipo_edit', 'ipo_create')
@Post('bulk-update')
async bulkUpdate() { ... }
```

### 2. Guards

The system uses two guards in combination:
- **JwtAuthGuard** - Validates JWT token
- **PermissionsGuard** - Checks user permissions

```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('ipo')
export class IpoController { ... }
```

### 3. Permission Service

The `PermissionsService` provides methods for:
- Managing permissions
- Assigning/removing user permissions
- Checking user permissions
- Bulk operations

## API Endpoints

### Permission Management

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | `/permissions/list` | Get all permissions | `user_read` |
| GET | `/permissions/module/:module` | Get permissions by module | `user_read` |
| GET | `/permissions/user/:userId` | Get user permissions | `user_read` |
| POST | `/permissions/assign` | Assign permission to user | `user_edit` |
| DELETE | `/permissions/user/:userId/permission/:permissionId` | Remove user permission | `user_edit` |
| GET | `/permissions/check/:userId/:permissionName` | Check user permission | `user_read` |

### IPO Module

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | `/ipo/list` | Get all IPO applications | `ipo_read` |
| GET | `/ipo/:id` | Get specific IPO application | `ipo_read` |
| POST | `/ipo/create` | Create new IPO application | `ipo_create` |
| PUT | `/ipo/:id` | Update IPO application | `ipo_edit` |
| DELETE | `/ipo/:id` | Delete IPO application | `ipo_delete` |

### Inward Module

| Method | Endpoint | Description | Required Permission |
|--------|----------|-------------|-------------------|
| GET | `/inward/list` | Get all inward applications | `inward_read` |
| GET | `/inward/:id` | Get specific inward application | `inward_read` |
| POST | `/inward/create` | Create new inward application | `inward_create` |
| PUT | `/inward/:id` | Update inward application | `inward_edit` |
| DELETE | `/inward/:id` | Delete inward application | `inward_delete` |

## Setup Instructions

### 1. Database Migration

Run the migrations to create the permission tables:

```bash
npm run migration:run
```

### 2. Seed Default Permissions

Seed the database with default permissions:

```bash
npm run seed:run
```

### 3. Assign Permissions to Users

Use the permission management endpoints to assign permissions to users:

```bash
# Assign IPO read permission to a user
curl -X POST http://localhost:3000/permissions/assign \
  -H "Authorization: Bearer <jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "permissionId": "ipo-read-permission-uuid"
  }'
```

## Usage Examples

### 1. Creating a Protected Route

```typescript
@Controller('ipo')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IpoController {
  @Get('list')
  @RequireModulePermission('ipo', 'read')
  async getIpoList() {
    return this.ipoService.getAllIpoApplications();
  }

  @Post('create')
  @RequireModulePermission('ipo', 'create')
  async createIpo(@Body() createIpoDto: CreateIpoDto) {
    return this.ipoService.createIpoApplication(createIpoDto);
  }
}
```

### 2. Checking Permissions in Service

```typescript
@Injectable()
export class SomeService {
  constructor(private permissionsService: PermissionsService) {}

  async someMethod(userId: string) {
    const hasPermission = await this.permissionsService.userHasPermission(
      userId,
      'ipo_read'
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    // Continue with operation
  }
}
```

### 3. Assigning Permissions Programmatically

```typescript
// Assign single permission
await this.permissionsService.assignPermissionToUser(
  userId,
  permissionId
);

// Assign multiple permissions
await this.permissionsService.assignMultiplePermissionsToUser(
  userId,
  [permissionId1, permissionId2, permissionId3]
);
```

## Error Handling

### 403 Forbidden
Returned when user lacks required permissions:
```json
{
  "statusCode": 403,
  "message": "Access denied. Required permissions: ipo_read",
  "error": "Forbidden"
}
```

### 401 Unauthorized
Returned when JWT token is invalid or missing:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Security Considerations

1. **JWT Token Validation** - All protected routes require valid JWT tokens
2. **Permission Verification** - Each request is checked against user permissions
3. **Database Constraints** - Unique constraints prevent duplicate permissions
4. **Cascade Deletion** - User permission cleanup on user deletion

## Testing

### Unit Tests
Test individual components like services and guards.

### Integration Tests
Test complete API endpoints with permission scenarios.

### Example Test
```typescript
describe('IPO Controller', () => {
  it('should allow access with proper permission', async () => {
    const response = await request(app)
      .get('/ipo/list')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);
  });

  it('should deny access without permission', async () => {
    const response = await request(app)
      .get('/ipo/list')
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(403);
  });
});
```

## Best Practices

1. **Principle of Least Privilege** - Assign only necessary permissions
2. **Regular Permission Audits** - Review user permissions periodically
3. **Role-Based Assignment** - Create permission sets for common roles
4. **Documentation** - Document permission requirements for each endpoint
5. **Testing** - Test both authorized and unauthorized access scenarios

## Troubleshooting

### Common Issues

1. **Permission Not Found** - Ensure permissions are seeded in database
2. **User Not Found** - Verify user exists and is properly authenticated
3. **Token Issues** - Check JWT token validity and expiration
4. **Database Connection** - Ensure database is accessible and migrations are run

### Debug Mode

Enable debug logging to troubleshoot permission issues:
```typescript
// In permissions.guard.ts
console.log('Required permissions:', requiredPermissions);
console.log('User permissions:', userPermissions);
```

## Future Enhancements

1. **Role-Based Permissions** - Group permissions into roles
2. **Permission Inheritance** - Allow permissions to inherit from roles
3. **Temporary Permissions** - Time-limited permission assignments
4. **Audit Logging** - Track permission changes and usage
5. **Permission Templates** - Predefined permission sets for common scenarios

This permission system provides a robust foundation for controlling API access while maintaining flexibility for future enhancements.

