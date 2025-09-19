import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({example: 'admin@gmail.com'})
  email: string;

  @ApiProperty({example: 'admin'})
  password: string;
}