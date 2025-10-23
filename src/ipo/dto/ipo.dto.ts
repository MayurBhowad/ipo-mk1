import { IsString, IsNumber, IsDateString, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateIpoDto {
  @IsString()
  company_name: string;

  @IsString()
  symbol: string;

  @IsNumber()
  @Min(0)
  issue_price: number;

  @IsNumber()
  @Min(1)
  total_shares: number;

  @IsDateString()
  issue_start_date: string;

  @IsDateString()
  issue_end_date: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateIpoDto {
  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  symbol?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  issue_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  total_shares?: number;

  @IsOptional()
  @IsDateString()
  issue_start_date?: string;

  @IsOptional()
  @IsDateString()
  issue_end_date?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'completed'])
  status?: string;
}

