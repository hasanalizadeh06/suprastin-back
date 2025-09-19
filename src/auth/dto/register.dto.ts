import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  username: string;

  @ApiProperty({example: 'string@gmail.com', required: true})
  email: string;

  @ApiProperty()
  password: string;
}