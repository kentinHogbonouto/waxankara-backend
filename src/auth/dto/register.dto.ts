import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'kofi@exemple.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'motdepasse123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Kofi Mensah' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: '+229 01 96 42 63 63', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
