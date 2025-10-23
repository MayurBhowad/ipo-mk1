import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IpoService } from './ipo.service';
import { CreateIpoDto, UpdateIpoDto } from './dto/ipo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../permissions/permissions.guard';
import { RequireModulePermission, Permissions } from '../permissions/permissions.decorator';

@Controller('ipo')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IpoController {
  constructor(private readonly ipoService: IpoService) {}

  // Get all IPO applications - requires ipo_read permission
  @Get('list')
  @RequireModulePermission('ipo', 'read')
  async getAllIpoApplications() {
    return this.ipoService.getAllIpoApplications();
  }

  // Get IPO applications by status - requires ipo_read permission
  @Get('status/:status')
  @RequireModulePermission('ipo', 'read')
  async getIpoApplicationsByStatus(@Param('status') status: string) {
    return this.ipoService.getIpoApplicationsByStatus(status);
  }

  // Get specific IPO application - requires ipo_read permission
  @Get(':id')
  @RequireModulePermission('ipo', 'read')
  async getIpoApplicationById(@Param('id') id: string) {
    return this.ipoService.getIpoApplicationById(id);
  }

  // Create new IPO application - requires ipo_create permission
  @Post('create')
  @RequireModulePermission('ipo', 'create')
  async createIpoApplication(@Body() createIpoDto: CreateIpoDto) {
    const ipoData = {
      ...createIpoDto,
      issue_start_date: new Date(createIpoDto.issue_start_date),
      issue_end_date: new Date(createIpoDto.issue_end_date),
    };
    return this.ipoService.createIpoApplication(ipoData);
  }

  // Update IPO application - requires ipo_edit permission
  @Put(':id')
  @RequireModulePermission('ipo', 'edit')
  async updateIpoApplication(
    @Param('id') id: string,
    @Body() updateIpoDto: UpdateIpoDto,
  ) {
    const updateData: any = { ...updateIpoDto };
    if (updateIpoDto.issue_start_date) {
      updateData.issue_start_date = new Date(updateIpoDto.issue_start_date);
    }
    if (updateIpoDto.issue_end_date) {
      updateData.issue_end_date = new Date(updateIpoDto.issue_end_date);
    }
    return this.ipoService.updateIpoApplication(id, updateData);
  }

  // Update IPO application status - requires ipo_edit permission
  @Put(':id/status')
  @RequireModulePermission('ipo', 'edit')
  async updateIpoStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.ipoService.updateIpoStatus(id, body.status);
  }

  // Delete IPO application - requires ipo_delete permission
  @Delete(':id')
  @RequireModulePermission('ipo', 'delete')
  async deleteIpoApplication(@Param('id') id: string) {
    const result = await this.ipoService.deleteIpoApplication(id);
    return { message: 'IPO application deleted successfully', deletedCount: result };
  }

  // Example of route requiring multiple permissions
  @Post('bulk-update')
  @Permissions('ipo_edit', 'ipo_create')
  async bulkUpdateIpoApplications(@Body() updates: any[]) {
    // This route requires either ipo_edit OR ipo_create permission
    return { message: 'Bulk update functionality', updates };
  }
}

