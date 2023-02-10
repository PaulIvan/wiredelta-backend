import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { JwtGuard } from '../auth/guard';
import {
  CreatePokemonDto,
  EditPokemonDto,
  GetPokemonsDto,
} from './dto';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('pokemons')
export class PokemonController {
  constructor(
    private pokemonService: PokemonService,
  ) {}

  @Post()
  createPokemon(
    @Body() dto: CreatePokemonDto,
    @GetUser('id') userId: number,
  ) {
    return this.pokemonService.createPokemon(
      userId,
      dto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('/get')
  getPokemons(@Body() dto: GetPokemonsDto) {
    return this.pokemonService.getPokemons(dto);
  }

  @Get(':id')
  getPokemonById(
    @Param('id', ParseIntPipe) pokemonId: number,
  ) {
    return this.pokemonService.getPokemonById(
      pokemonId,
    );
  }

  @Patch(':id')
  editPokemonById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) pokemonId: number,
    @Body() dto: EditPokemonDto,
  ) {
    return this.pokemonService.editPokemonById(
      userId,
      pokemonId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePokemonById(
    @Param('id', ParseIntPipe) pokemonId: number,
  ) {
    return this.pokemonService.deletePokemonById(
      pokemonId,
    );
  }
}
