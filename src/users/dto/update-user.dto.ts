import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'newusername', required: false, type: String })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'newemail@example.com', required: false, type: String })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'https://your-bucket.com/profile.jpg', required: false, type: String })
  @IsOptional()
  @IsString()
  photo?: string;

}
