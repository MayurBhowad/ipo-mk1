import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IpoApplication } from './ipo.model';

@Injectable()
export class IpoService {
  constructor(
    @InjectModel(IpoApplication)
    private ipoModel: typeof IpoApplication,
  ) {}

  // Get all IPO applications
  async getAllIpoApplications(): Promise<IpoApplication[]> {
    return this.ipoModel.findAll({
      order: [['created_at', 'DESC']],
    });
  }

  // Get IPO application by ID
  async getIpoApplicationById(id: string): Promise<IpoApplication | null> {
    return this.ipoModel.findByPk(id);
  }

  // Create new IPO application
  async createIpoApplication(ipoData: {
    company_name: string;
    symbol: string;
    issue_price: number;
    total_shares: number;
    issue_start_date: Date;
    issue_end_date: Date;
    description?: string;
  }): Promise<IpoApplication> {
    return this.ipoModel.create(ipoData);
  }

  // Update IPO application
  async updateIpoApplication(
    id: string,
    updateData: Partial<IpoApplication>,
  ): Promise<[number, IpoApplication[]]> {
    return this.ipoModel.update(updateData, {
      where: { id },
      returning: true,
    });
  }

  // Delete IPO application
  async deleteIpoApplication(id: string): Promise<number> {
    return this.ipoModel.destroy({
      where: { id },
    });
  }

  // Get IPO applications by status
  async getIpoApplicationsByStatus(status: string): Promise<IpoApplication[]> {
    return this.ipoModel.findAll({
      where: { status },
      order: [['created_at', 'DESC']],
    });
  }

  // Update IPO application status
  async updateIpoStatus(
    id: string,
    status: string,
  ): Promise<[number, IpoApplication[]]> {
    return this.ipoModel.update(
      { status },
      {
        where: { id },
        returning: true,
      },
    );
  }
}

