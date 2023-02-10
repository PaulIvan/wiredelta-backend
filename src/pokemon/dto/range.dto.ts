import { IsNotEmpty, IsNumber } from 'class-validator';

export class Range {
  @IsNotEmpty()
  @IsNumber()
  min: number;

  @IsNotEmpty()
  @IsNumber()
  max: number;
}
