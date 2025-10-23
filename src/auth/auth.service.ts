import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    public usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Validate credentials
  async validateUser(email: string, pass: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (user) {
        // Get the password from dataValues since Sequelize stores it there
        const password = user.getDataValue('password');
        
        if (password) {
          // Ensure we have a valid password hash
          if (password.length < 10) {
            console.log('Password appears to be plain text, not hashed');
            return null;
          }
          
          const isPasswordValid = await bcrypt.compare(pass, password);
          console.log("Password comparison result:", isPasswordValid);
          
          if (isPasswordValid) {
            const { password, ...result } = user.get({ plain: true });
            return result;
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error in validateUser:', error);
      return null;
    }
  }

  // Login → issue token
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  // Register → hash password → create user
  async register(dto: { email: string; password: string; role?: string }) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Create user with hashed password
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      role: (dto.role as 'admin' | 'manager' | 'staff') || 'staff',
    });
    
    // Return user data without password
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    return this.login(userWithoutPassword);
  }
}
