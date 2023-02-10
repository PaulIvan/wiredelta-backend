import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePokemonDto,
  EditPokemonDto,
  GetPokemonsDto,
  OrderBy,
} from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PokemonService {
  constructor(private prisma: PrismaService) {}
  async createPokemon(userId: number, dto: CreatePokemonDto) {
    return await this.prisma.pokemon.create({
      data: {
        createdBy: userId,
        updatedBy: userId,
        ...dto,
      },
    });
  }

  async getPokemons(dto: GetPokemonsDto) {
    if (!dto) {
      dto = new GetPokemonsDto();
    }

    return await this.prisma.pokemon.findMany({
      ...(dto.skip ? { skip: dto.skip } : {}),
      ...(dto.take ? { take: dto.take } : {}),
      where: {
        ...(dto.pokemonNameFilter ? { name: dto.pokemonNameFilter } : {}),
        ...(dto.pokemonHeightRange
          ? {
              height: {
                gte: dto.pokemonHeightRange.min,
                lte: dto.pokemonHeightRange.max,
              },
            }
          : {}),
        ...(dto.pokemonWeightRange
          ? {
              weight: {
                gte: dto.pokemonWeightRange.min,
                lte: dto.pokemonWeightRange.max,
              },
            }
          : {}),
      },
      orderBy: {
        ...(dto.orderBy == OrderBy.id ? { id: dto.order } : {}),
        ...(dto.orderBy == OrderBy.name ? { name: dto.order } : {}),
        ...(dto.orderBy == OrderBy.height ? { height: dto.order } : {}),
        ...(dto.orderBy == OrderBy.weight ? { weight: dto.order } : {}),
      },
    });
  }

  async getPokemonById(pokemonId: number) {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id: pokemonId },
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon with this Id does not exist.');
    }

    return pokemon;
  }

  async editPokemonById(
    userId: number,
    pokemonId: number,
    dto: EditPokemonDto,
  ) {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id: pokemonId },
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon with this Id does not exist.');
    }

    return await this.prisma.pokemon.update({
      where: { id: pokemonId },
      data: { updatedBy: userId, ...dto },
    });
  }

  async deletePokemonById(pokemonId: number) {
    const pokemon = await this.prisma.pokemon.findUnique({
      where: { id: pokemonId },
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon with this Id does not exist.');
    }

    await this.prisma.pokemon.delete({
      where: {
        id: pokemonId,
      },
    });
  }
}
