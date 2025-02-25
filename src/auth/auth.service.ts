import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  private users = [];

  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Token verification function

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userModel
        .findById(decoded.sub)
        .select('-password');

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }
      return {
        status: true,
        message: 'Token is valid.',
        user,
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  // Register Users

  async registerUsers(username: string, email: string, password: string) {
    try {
      // Check if user already exists by email or username
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        return {
          code: 400,
          status: false,
          message: `User with this email already exists.`,
        };
      } else {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new this.userModel({
          username,
          email,
          password: hashedPassword,
        });
        await newUser.save();

        // Generate JWT token
        const payload = { email: newUser.email, sub: newUser._id };
        const token = this.jwtService.sign(payload);

        // Remove password by setting it to an empty Undefined
        const userResponse = { ...newUser.toObject(), password: '' };

        return {
          code: 201,
          status: true,
          message: 'User registered successfully.',
          data: { user: userResponse, token },
        };
      }
    } catch (error) {
      console.error('Error in registerUsers:______________', error);
      return {
        code: 400,
        status: false,
        message: 'Error registering user.',
        error: error.message,
      };
    }
  }

  async loginUsers(
    email: string,
    password: string,
  ): Promise<{ status: boolean; message: string; data?: any; error?: any }> {
    try {
      // Find user by email
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return {
          status: false,
          message: 'Invalid email or password.',
        };
      }

      // Compare provided password with stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          status: false,
          message: 'Invalid email or password.',
        };
      }

      // Generate JWT token
      const payload = { email: user.email, sub: user._id };
      const token = this.jwtService.sign(payload);

      // Remove password from the response
      const userResponse = { ...user.toObject(), password: '' };

      return {
        status: true,
        message: 'User logged in successfully.',
        data: { user: userResponse, token },
      };
    } catch (error) {
      console.error('Error in loginUser:', error);
      return {
        status: false,
        message: 'Error logging in user.',
        error: error.message,
      };
    }
  }
}
