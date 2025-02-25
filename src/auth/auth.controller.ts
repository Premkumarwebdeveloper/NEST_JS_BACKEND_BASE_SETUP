import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() body: { username: string; email: string; password: string },
  ) {
    return this.authService.registerUsers(
      body.username,
      body.email,
      body.password,
    );
  }

  @Post('login')
  @UseGuards(AuthGuard)
  login(@Body() body: { email: string; password: string }) {
    return this.authService.loginUsers(body.email, body.password);
  }
}
