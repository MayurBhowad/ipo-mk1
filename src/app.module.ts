import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employee.module';
import { BranchesModule } from './branches/branche.module';
import { PermissionsModule } from './permissions/permissions.module';
import { IpoModule } from './ipo/ipo.module';
import { AdminModule } from './admin/admin.module';
import { Employee } from './employees/employee.model';
import { Branch } from './branches/branch.model';
import { User } from './users/user.model';
import { Permission } from './permissions/permission.model';
import { UserPermission } from './permissions/user-permission.model';
import { IpoApplication } from './ipo/ipo.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT||'3306'),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        models: [User, Employee, Branch, Permission, UserPermission, IpoApplication],
        autoLoadModels: true,
        synchronize: true, // disable in prod; prefer migrations
      })
    }),
    UsersModule,
    AuthModule,
    EmployeesModule,
    BranchesModule,
    PermissionsModule,
    IpoModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
