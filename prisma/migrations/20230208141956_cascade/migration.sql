-- DropForeignKey
ALTER TABLE "pokemons" DROP CONSTRAINT "pokemons_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "pokemons" DROP CONSTRAINT "pokemons_updatedBy_fkey";

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
