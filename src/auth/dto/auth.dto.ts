import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(['admin', 'manager', 'staff'])
  role?: 'admin' | 'manager' | 'staff';
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
