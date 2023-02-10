import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';
import {
  CreatePokemonDto,
  EditPokemonDto,
  GetPokemonsDto,
  Order,
  OrderBy,
} from '../src/pokemon/dto';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { int } from 'pactum-matchers';

describe('App e2e', () => {
  let app: NestFastifyApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app =
      moduleRef.createNestApplication<NestFastifyApplication>(
        new FastifyAdapter(),
      );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl(
      'http://localhost:3333',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'paul@email.com',
      password: 'password',
    };
    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should signup second user', () => {
        const dto2: AuthDto = {
          email: 'paul2@email.com',
          password: 'password',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto2)
          .expectStatus(201)
          .stores('secondUserAt', 'access_token');
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Get second me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization:
              'Bearer $S{secondUserAt}',
          })
          .expectStatus(200)
          .stores('secondUserId', 'id');
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: 'Paul',
          email: 'paul23@email.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Pokemons', () => {
    describe('Get Empty Pokemons', () => {
      const dto: GetPokemonsDto = {
        skip: 0,
        take: 10,
      };
      it('should return empty pokemons', () => {
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Pokemons', () => {
      const dto: CreatePokemonDto = {
        name: 'Pikachu',
        height: 1,
        weight: 1,
        image: 'https://www.google.com',
      };
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('pokemonId', 'id')
          .expectStatus(201);
      });

      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
      it('should create a pokemon', () => {
        dto.height++;
        dto.weight++;
        dto.name = dto.name + dto.height;
        return pactum
          .spec()
          .post('/pokemons')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Get All Pokemons pagination', () => {
      it('should get the first 50 pokemons', () => {
        const dto: GetPokemonsDto = {
          skip: 0,
          take: 50,
          orderBy: OrderBy.id,
          order: Order.ASC,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(50)
          .expectJsonLike([{ id: 50 }]);
      });

      it('should get the other 50 pokemons', () => {
        const dto: GetPokemonsDto = {
          skip: 50,
          take: 50,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(50)
          .expectJsonLike([{ id: 100 }]);
      });
    });

    describe('Get Pokemon by Id', () => {
      it('should get pokemon by Id', () => {
        return pactum
          .spec()
          .get('/pokemons/{id}')
          .withPathParams('id', '$S{pokemonId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{pokemonId}');
      });
    });

    describe('Get Pokemon with wrong Id', () => {
      it('should return not found', () => {
        return pactum
          .spec()
          .get('/pokemons/{id}')
          .withPathParams('id', 0)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404)
          .expectBodyContains(
            'Pokemon with this Id does not exist.',
          );
      });
    });

    describe('Edit Pokemon', () => {
      const dto: EditPokemonDto = {
        name: 'Edited Pickachu',
        height: 0,
      };

      it('User B should be able to edit a pokemon created by User A', () => {
        return pactum
          .spec()
          .patch('/pokemons/{id}')
          .withPathParams('id', '$S{pokemonId}')
          .withHeaders({
            Authorization:
              'Bearer $S{secondUserAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLike({
            updatedBy: '$S{secondUserId}',
          })
          .expectBodyContains('$S{pokemonId}')
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.height);
      });
    });

    describe('Edit Pokemon with wrong id', () => {
      const dto: EditPokemonDto = {
        name: 'Edited Pickachu',
        height: 0,
      };
      it('should return 404', () => {
        return pactum
          .spec()
          .patch('/pokemons/{id}')
          .withPathParams('id', 0)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(404)
          .expectBodyContains(
            'Pokemon with this Id does not exist.',
          );
      });
    });

    describe('Delete Pokemon by Id', () => {
      it('should delete pokemon', () => {
        return pactum
          .spec()
          .delete('/pokemons/{id}')
          .withPathParams('id', '$S{pokemonId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
    });

    describe('Delete Pokemon with wrong Id', () => {
      it('should return 404', () => {
        return pactum
          .spec()
          .delete('/pokemons/{id}')
          .withPathParams('id', '$S{pokemonId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404)
          .expectBodyContains(
            'Pokemon with this Id does not exist.',
          );
      });
    });

    describe('Get Pokemons by name', () => {
      const dto: GetPokemonsDto = {
        take: 50,
        skip: 0,
        pokemonNameFilter: 'Pikachu2',
      };
      it('should get pokemons filtered by name', () => {
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(1)
          .expectJsonLike([{ name: 'Pikachu2' }]);
      });
    });

    describe('Get Pokemon by height range', () => {
      const dto: GetPokemonsDto = {
        take: 50,
        skip: 0,
        pokemonHeightRange: { min: 1, max: 5 },
      };
      it('should get pokemons filtered by height range', () => {
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(5)
          .expectJsonLike([{ height: 1 }])
          .expectJsonLike([{ height: 2 }])
          .expectJsonLike([{ height: 3 }])
          .expectJsonLike([{ height: 4 }])
          .expectJsonLike([{ height: 5 }]);
      });
    });

    describe('Get Pokemon by weight range', () => {
      const dto: GetPokemonsDto = {
        take: 50,
        skip: 0,
        pokemonWeightRange: { min: 1, max: 5 },
      };
      it('should get pokemons filtered by weight range', () => {
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(5)
          .expectJsonLike([{ weight: 1 }])
          .expectJsonLike([{ weight: 2 }])
          .expectJsonLike([{ weight: 3 }])
          .expectJsonLike([{ weight: 4 }])
          .expectJsonLike([{ weight: 5 }]);
      });
    });

    describe('Sort Pokemons by name desc', () => {
      it('should get pokemons sorted by name desc', () => {
        const dto: GetPokemonsDto = {
          take: 10,
          skip: 0,
          orderBy: OrderBy.name,
          order: Order.DESC,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(10)
          .expectJsonLike([
            {
              name: 'Pikachu23456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100101102103104',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu23456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100101102103',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu23456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100101102',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu23456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100101',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu23456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899100',
            },
          ]);
      });
    });

    describe('Sort Pokemons by name asc', () => {
      it('should get pokemons sorted by name asc', () => {
        const dto: GetPokemonsDto = {
          take: 10,
          skip: 0,
          orderBy: OrderBy.name,
          order: Order.ASC,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(10)
          .expectJsonLike([
            {
              name: 'Pikachu',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu2',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu23',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu234',
            },
          ])
          .expectJsonLike([
            {
              name: 'Pikachu2345',
            },
          ]);
      });
    });
    describe('Sort Pokemons by height asc', () => {
      it('should get pokemons sorted by height asc', () => {
        const dto: GetPokemonsDto = {
          take: 10,
          skip: 0,
          orderBy: OrderBy.height,
          order: Order.ASC,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(10)
          .expectJsonLike([
            {
              height: 1,
            },
          ])
          .expectJsonLike([
            {
              height: 2,
            },
          ])
          .expectJsonLike([
            {
              height: 7,
            },
          ])
          .expectJsonLike([
            {
              height: 8,
            },
          ])
          .expectJsonLike([
            {
              height: 9,
            },
          ]);
      });
    });

    describe('Sort Pokemons by height desc', () => {
      it('should get pokemons sorted by height desc', () => {
        const dto: GetPokemonsDto = {
          take: 10,
          skip: 0,
          orderBy: OrderBy.height,
          order: Order.DESC,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(10)
          .expectJsonLike([
            {
              height: 109,
            },
          ])
          .expectJsonLike([
            {
              height: 108,
            },
          ])
          .expectJsonLike([
            {
              height: 103,
            },
          ])
          .expectJsonLike([
            {
              height: 102,
            },
          ])
          .expectJsonLike([
            {
              height: 100,
            },
          ]);
      });
    });

    describe('Sort Pokemons by weight asc', () => {
      it('should get pokemons sorted by weight asc', () => {
        const dto: GetPokemonsDto = {
          take: 10,
          skip: 0,
          orderBy: OrderBy.weight,
          order: Order.ASC,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(10)
          .expectJsonLike([
            {
              weight: 1,
            },
          ])
          .expectJsonLike([
            {
              weight: 2,
            },
          ])
          .expectJsonLike([
            {
              weight: 7,
            },
          ])
          .expectJsonLike([
            {
              weight: 8,
            },
          ])
          .expectJsonLike([
            {
              weight: 9,
            },
          ]);
      });
    });

    describe('Sort Pokemons by weight desc', () => {
      it('should get pokemons sorted by weight desc', () => {
        const dto: GetPokemonsDto = {
          take: 10,
          skip: 0,
          orderBy: OrderBy.weight,
          order: Order.DESC,
        };
        return pactum
          .spec()
          .post('/pokemons/get')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectJsonLength(10)
          .expectJsonLike([
            {
              weight: 109,
            },
          ])
          .expectJsonLike([
            {
              weight: 108,
            },
          ])
          .expectJsonLike([
            {
              weight: 103,
            },
          ])
          .expectJsonLike([
            {
              weight: 102,
            },
          ])
          .expectJsonLike([
            {
              weight: 100,
            },
          ]);
      });
    });
  });
});
