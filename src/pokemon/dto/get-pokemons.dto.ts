import {
  IsEnum,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Order } from './order.enum';
import { OrderBy } from './orderBy.enum';
import { Range } from './range.dto';
import { Type } from 'class-transformer';

export class GetPokemonsDto {
  @IsIn([10, 20, 50])
  @IsInt()
  @IsNotEmpty()
  take: number;

  @IsIn([0, 10, 20, 50])
  @IsInt()
  @IsNotEmpty()
  skip: number;

  @IsEnum(Order)
  @IsOptional()
  order?: Order = Order.ASC;

  @IsEnum(OrderBy)
  @IsOptional()
  orderBy?: OrderBy = OrderBy.id;

  @IsString()
  @IsOptional()
  pokemonNameFilter?: string;

  @IsOptional()
  @Type(() => Range)
  @ValidateNested({ each: true })
  pokemonHeightRange?: Range;

  @ValidateNested({ each: true })
  @Type(() => Range)
  @IsOptional()
  pokemonWeightRange?: Range;
}
