import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUserByEmail(body.email, body.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(
      body.username,
      body.email,
      body.password,
    );
    return { message: 'User registered', user };
  }
  @Post('logout')
  async logout() {
    // For stateless JWT, logout is handled on client by deleting the token
    return { message: 'Logged out successfully' };
  }

  @Post('login-otp')
    @ApiBody({
      type: require('./dto/otp.dto').LoginWithOtpDto,
      examples: {
        default: {
          summary: 'Login with email and password',
          value: {
            email: 'user@example.com',
            password: 'yourPassword123',
          },
        },
      },
    })
  async loginWithOtp(@Body() body: any) {
    const user = await this.authService.validateUserByEmail(body.email, body.password);
    if (!user) {
      return { error: 'Invalid credentials' };
    }
    await this.authService.sendOtpToEmail(body.email);
    return { message: 'Authentication code sent to email.' };
  }

  @Post('verify-otp')
    @ApiBody({
      type: require('./dto/otp.dto').VerifyOtpDto,
      examples: {
        default: {
          summary: 'Verify OTP code',
          value: {
            email: 'user@example.com',
            code: '123456',
          },
        },
      },
    })
  async verifyOtp(@Body() body: any) {
    const result = await this.authService.verifyOtpAndLogin(body.email, body.code);
    if (!result) {
      return { error: 'Invalid or expired code.' };
    }
    return result;
  }
}