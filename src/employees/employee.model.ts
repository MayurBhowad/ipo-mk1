import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Branch } from '../branches/branch.model';
import { User } from 'src/users/user.model';

@Table({tableName:'employees', timestamps:true})
export class Employee extends Model {
  @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey:true})
  declare id: string;

  @Column
  name: string;

  @Column
  address: string;

  @Column
  pincode: string;

  @Column(DataType.DECIMAL)
  salary: number;

  @Column
  department: string;

  @ForeignKey(() => Branch)
  @Column
  branchId: string;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => Branch)
  branch: Branch;
}
