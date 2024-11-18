/*
  Warnings:

  - You are about to drop the column `apellido` on the `Administrador` table. All the data in the column will be lost.
  - You are about to drop the column `direccionId` on the `Administrador` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Administrador" DROP CONSTRAINT "Administrador_direccionId_fkey";

-- DropForeignKey
ALTER TABLE "Profesional" DROP CONSTRAINT "Profesional_direccionId_fkey";

-- DropForeignKey
ALTER TABLE "Responsable" DROP CONSTRAINT "Responsable_direccionId_fkey";

-- DropIndex
DROP INDEX "Administrador_direccionId_key";

-- DropIndex
DROP INDEX "Profesional_direccionId_key";

-- DropIndex
DROP INDEX "Responsable_direccionId_key";

-- AlterTable
ALTER TABLE "Administrador" DROP COLUMN "apellido",
DROP COLUMN "direccionId";

-- AlterTable
ALTER TABLE "Alumno" ALTER COLUMN "telefono" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Profesional" ALTER COLUMN "telefono" SET DATA TYPE TEXT,
ALTER COLUMN "direccionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Responsable" ALTER COLUMN "telefono" SET DATA TYPE TEXT,
ALTER COLUMN "direccionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsable" ADD CONSTRAINT "Responsable_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
