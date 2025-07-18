// update-user.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  fullname?: string;
}

export class UserProfileResponseDto {
  id: string;
  email: string;
  username: string;
  fullname: string;
} 