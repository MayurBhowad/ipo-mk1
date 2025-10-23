import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Employee } from './employee.model';

@Module({
  imports: [SequelizeModule.forFeature([Employee])],
  exports: [SequelizeModule],
})
export class EmployeesModule {}
