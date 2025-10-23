import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Employee } from '../employees/employee.model';

@Table({tableName:'branches', timestamps:true})
export class Branch extends Model {
  @Column({type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey:true})
  declare id: string;

  @Column({allowNull:false})
  name: string;

  @Column
  address: string;

  @HasMany(() => Employee)
  employees: Employee[];
}
