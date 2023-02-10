import { IsInt, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  height: number;

  @IsInt()
  @IsNotEmpty()
  weight: number;

  @IsUrl()
  @IsNotEmpty()
  image: string;
}
