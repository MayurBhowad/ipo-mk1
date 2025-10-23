import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserPermission } from './user-permission.model';

@Table({ tableName: 'permissions', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class Permission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    unique: true,
    allowNull: false,
  })
  permission_name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  module: string; // e.g., 'ipo', 'inward', 'corporate'

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  action: string; // e.g., 'read', 'create', 'edit', 'delete'

  @HasMany(() => UserPermission)
  userPermissions: UserPermission[];
}
