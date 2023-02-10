/*
  Warnings:

  - Added the required column `createdBy` to the `pokemons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `pokemons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pokemons" ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "updatedBy" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
