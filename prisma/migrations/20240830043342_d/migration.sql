/*
  Warnings:

  - You are about to drop the column `nacionalidadId` on the `Direccion` table. All the data in the column will be lost.
  - You are about to drop the column `provinciaId` on the `Direccion` table. All the data in the column will be lost.
  - Added the required column `calle` to the `Direccion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinciaId` to the `Localidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nacionalidadId` to the `Provincia` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Direccion" DROP CONSTRAINT "Direccion_nacionalidadId_fkey";

-- DropForeignKey
ALTER TABLE "Direccion" DROP CONSTRAINT "Direccion_provinciaId_fkey";

-- DropIndex
DROP INDEX "Alumno_direccionId_key";

-- DropIndex
DROP INDEX "Direccion_localidadId_key";

-- DropIndex
DROP INDEX "Direccion_nacionalidadId_key";

-- DropIndex
DROP INDEX "Direccion_provinciaId_key";

-- DropIndex
DROP INDEX "Profesional_direccionId_key";

-- AlterTable
ALTER TABLE "Alumno" ALTER COLUMN "telefono" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Direccion" DROP COLUMN "nacionalidadId",
DROP COLUMN "provinciaId",
ADD COLUMN     "calle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Localidad" ADD COLUMN     "provinciaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profesional" ALTER COLUMN "telefono" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Provincia" ADD COLUMN     "nacionalidadId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_nacionalidadId_fkey" FOREIGN KEY ("nacionalidadId") REFERENCES "Nacionalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localidad" ADD CONSTRAINT "Localidad_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
