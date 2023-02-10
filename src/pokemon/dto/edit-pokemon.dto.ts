import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class EditPokemonDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  height?: number;

  @IsInt()
  @IsOptional()
  weight?: number;

  @IsUrl()
  @IsOptional()
  image?: string;
}
