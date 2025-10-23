import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ipo_applications', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' })
export class IpoApplication extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  company_name: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  symbol: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  issue_price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  total_shares: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  issue_start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  issue_end_date: Date;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;
}

