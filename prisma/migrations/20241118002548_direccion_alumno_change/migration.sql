/*
  Warnings:

  - Made the column `edadMaxima` on table `Curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `edadMinima` on table `Curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fechaFin` on table `Curso` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fechaInicio` on table `Curso` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Alumno_direccionId_key";

-- AlterTable
ALTER TABLE "Curso" ALTER COLUMN "edadMaxima" SET NOT NULL,
ALTER COLUMN "edadMinima" SET NOT NULL,
ALTER COLUMN "fechaFin" SET NOT NULL,
ALTER COLUMN "fechaInicio" SET NOT NULL;
