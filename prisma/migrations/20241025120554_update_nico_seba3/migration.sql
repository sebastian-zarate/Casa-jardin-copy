/*
  Warnings:

  - You are about to drop the column `responsableId` on the `SolicitudMenores` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SolicitudMenores" DROP CONSTRAINT "SolicitudMenores_responsableId_fkey";

-- DropIndex
DROP INDEX "SolicitudMenores_responsableId_key";

-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ADD COLUMN     "mayoriaEdad" BOOLEAN;

-- AlterTable
ALTER TABLE "SolicitudMenores" DROP COLUMN "responsableId";
