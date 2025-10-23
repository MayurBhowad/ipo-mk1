import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Permission } from './permission.model';

@Table({ tableName: 'user_permissions', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class UserPermission extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  permission_id: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Permission)
  permission: Permission;
}