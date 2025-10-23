import { Module } from '@nestjs/common';
import { Database, Resource } from '@adminjs/sequelize';
import AdminJS from 'adminjs';
import { User } from '../users/user.model';
import { Employee } from '../employees/employee.model';
import { Branch } from '../branches/branch.model';
import { Permission } from '../permissions/permission.model';
import { UserPermission } from '../permissions/user-permission.model';
import { IpoApplication } from '../ipo/ipo.model';

// Register the Sequelize adapter
AdminJS.registerAdapter({ Database, Resource });

export const adminJsOptions = {
  rootPath: '/admin',
  resources: [
    {
      resource: User,
      options: {
        parent: {
          name: 'User Management',
          icon: 'User',
        },
        properties: {
          id: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          password: {
            isVisible: { list: false, filter: false, show: false, edit: true },
            type: 'password',
          },
          role: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            availableValues: [
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'staff', label: 'Staff' },
            ],
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
        listProperties: ['id', 'email', 'role', 'createdAt'],
        filterProperties: ['email', 'role'],
        editProperties: ['email', 'password', 'role'],
        showProperties: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
      },
    },
    {
      resource: Employee,
      options: {
        parent: {
          name: 'User Management',
          icon: 'User',
        },
        properties: {
          id: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          salary: {
            type: 'currency',
            currency: 'INR',
          },
          branchId: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          userId: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
        listProperties: ['id', 'name', 'department', 'salary', 'branchId'],
        filterProperties: ['name', 'department', 'branchId'],
        editProperties: ['name', 'address', 'pincode', 'salary', 'department', 'branchId', 'userId'],
        showProperties: ['id', 'name', 'address', 'pincode', 'salary', 'department', 'branchId', 'userId', 'createdAt', 'updatedAt'],
      },
    },
    {
      resource: Branch,
      options: {
        parent: {
          name: 'Branch Management',
          icon: 'Building',
        },
        properties: {
          id: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
        listProperties: ['id', 'name', 'address'],
        filterProperties: ['name'],
        editProperties: ['name', 'address'],
        showProperties: ['id', 'name', 'address', 'createdAt', 'updatedAt'],
      },
    },
    {
      resource: Permission,
      options: {
        parent: {
          name: 'Permission Management',
          icon: 'Shield',
        },
        properties: {
          id: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          permission_name: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          module: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            availableValues: [
              { value: 'ipo', label: 'IPO' },
              { value: 'inward', label: 'Inward' },
              { value: 'corporate', label: 'Corporate' },
              { value: 'employee', label: 'Employee' },
              { value: 'branch', label: 'Branch' },
            ],
          },
          action: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            availableValues: [
              { value: 'read', label: 'Read' },
              { value: 'create', label: 'Create' },
              { value: 'edit', label: 'Edit' },
              { value: 'delete', label: 'Delete' },
            ],
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
        listProperties: ['id', 'permission_name', 'module', 'action'],
        filterProperties: ['permission_name', 'module', 'action'],
        editProperties: ['permission_name', 'description', 'module', 'action'],
        showProperties: ['id', 'permission_name', 'description', 'module', 'action', 'createdAt', 'updatedAt'],
      },
    },
    {
      resource: UserPermission,
      options: {
        parent: {
          name: 'Permission Management',
          icon: 'Shield',
        },
        properties: {
          id: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          user_id: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          permission_id: {
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
        listProperties: ['id', 'user_id', 'permission_id'],
        filterProperties: ['user_id', 'permission_id'],
        editProperties: ['user_id', 'permission_id'],
        showProperties: ['id', 'user_id', 'permission_id', 'createdAt', 'updatedAt'],
      },
    },
    {
      resource: IpoApplication,
      options: {
        parent: {
          name: 'IPO Management',
          icon: 'ChartLine',
        },
        properties: {
          id: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          issue_price: {
            type: 'currency',
            currency: 'INR',
          },
          status: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            availableValues: [
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'completed', label: 'Completed' },
            ],
          },
          issue_start_date: {
            type: 'date',
          },
          issue_end_date: {
            type: 'date',
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
          },
        },
        listProperties: ['id', 'company_name', 'symbol', 'issue_price', 'status'],
        filterProperties: ['company_name', 'symbol', 'status'],
        editProperties: ['company_name', 'symbol', 'issue_price', 'total_shares', 'issue_start_date', 'issue_end_date', 'status', 'description'],
        showProperties: ['id', 'company_name', 'symbol', 'issue_price', 'total_shares', 'issue_start_date', 'issue_end_date', 'status', 'description', 'createdAt', 'updatedAt'],
      },
    },
  ],
  branding: {
    companyName: 'Your Company Admin',
    softwareBrothers: false,
  },
};

@Module({})
export class AdminModule {}