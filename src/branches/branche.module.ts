import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Branch } from './branch.model';

@Module({
  imports: [SequelizeModule.forFeature([Branch])],
  exports: [SequelizeModule],
})
export class BranchesModule {}
