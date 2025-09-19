import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    private mailService: MailService,
  ) {}
  async sendOtpToEmail(email: string) {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    await this.otpRepository.delete({ email }); // Remove old codes
    await this.otpRepository.save({ email, code, expiresAt });
    await this.mailService.sendMail(email, 'Your authentication code', `Your code: ${code}`);
    return true;
  }

  async verifyOtpAndLogin(email: string, code: string) {
    const otp = await this.otpRepository.findOne({ where: { email, code } });
    if (!otp || otp.expiresAt < Date.now()) {
      return null;
    }
    await this.otpRepository.delete({ email }); // Remove used code
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;
    return this.login(user);
  }

  async validateUserByEmail(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    username: string,
    email: string,
    password: string,
  ) {
    const hash = await bcrypt.hash(password, 10);
    return this.usersService.create(username, email, hash);
  }
}