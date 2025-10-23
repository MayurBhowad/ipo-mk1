import { 
  Controller, 
  Post, 
  Body, 
  Request, 
  UseGuards, 
  HttpException, 
  HttpStatus,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Registration endpoint
  @Post('register')
  async register(@Body() dto: any) {
    try {
      console.log('Registration attempt with:', dto);
      return await this.authService.register(dto);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException(`Registration failed: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  // Login endpoint
  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async login(@Body() dto: LoginDto) {
    try {
      const user = await this.authService.validateUser(dto.email, dto.password);
      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return this.authService.login(user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
    }
  }

  // Test bcrypt functionality
  @Post('test-bcrypt')
  async testBcrypt(@Body() dto: { password: string }) {
    try {
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(dto.password, 10);
      const comparison = await bcrypt.compare(dto.password, hash);
      
      return {
        originalPassword: dto.password,
        hashedPassword: hash,
        hashLength: hash.length,
        comparisonResult: comparison
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Simple test endpoint to check database connection
  @Post('test-db')
  async testDb() {
    try {
      const userCount = await this.authService.usersService.userModel.count();
      const allUsers = await this.authService.usersService.userModel.findAll({
        attributes: ['id', 'email', 'role']
      });
      
      return {
        success: true,
        userCount,
        users: allUsers
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Debug endpoint to test user lookup
  @Post('debug-user')
  async debugUser(@Body() dto: { email: string }) {
    try {
      const user = await this.authService.usersService.findByEmail(dto.email);
      return {
        found: !!user,
        user: user ? {
          id: user.id,
          email: user.email,
          role: user.role,
          passwordLength: user.password?.length
        } : null
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Verify token and fetch profile
  @UseGuards(JwtAuthGuard)
  @Post('me')
  async me(@Request() req) {
    return {
      user: req.user,
      message: 'Token is valid'
    };
  }
}
