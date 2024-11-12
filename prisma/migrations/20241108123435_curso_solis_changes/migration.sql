/*
  Warnings:

  - You are about to drop the column `year` on the `Curso` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "year",
ADD COLUMN     "edadMaxima" INTEGER,
ADD COLUMN     "edadMinima" INTEGER,
ADD COLUMN     "fechaFin" TIMESTAMP(3),
ADD COLUMN     "fechaInicio" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SolicitudMayores" ALTER COLUMN "firmaReglamento" DROP NOT NULL,
ALTER COLUMN "firmaUsoImagenes" DROP NOT NULL,
ALTER COLUMN "observacionesUsoImagenes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SolicitudMenores" ALTER COLUMN "firmaReglamento" DROP NOT NULL,
ALTER COLUMN "firmaSalidas" DROP NOT NULL,
ALTER COLUMN "firmaUsoImagenes" DROP NOT NULL,
ALTER COLUMN "observacionesSalidas" DROP NOT NULL,
ALTER COLUMN "observacionesUsoImagenes" DROP NOT NULL;
