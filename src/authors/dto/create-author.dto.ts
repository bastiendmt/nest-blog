import { IsEmail, IsString } from 'class-validator';

export class CreateAuthorDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
