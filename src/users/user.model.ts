import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { Employee } from '../employees/employee.model';

@Table({tableName: 'users', timestamps: true})
export class User extends Model {
  @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey:true})
  declare id: string;

  @Column({unique:true, allowNull:false})
  email: string;

  @Column({type: DataType.STRING(255), allowNull:false})
  password: string;

  @Column({allowNull:false, defaultValue:'staff'})
  role: 'admin' | 'manager' | 'staff';

  @HasOne(() => Employee)
  employee: Employee;
}
