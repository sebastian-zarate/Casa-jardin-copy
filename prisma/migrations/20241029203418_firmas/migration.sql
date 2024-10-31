/*
  Warnings:

  - Added the required column `firmaReglamento` to the `SolicitudMayores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firmaUsoImagenes` to the `SolicitudMayores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacionesUsoImagenes` to the `SolicitudMayores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firmaReglamento` to the `SolicitudMenores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firmaSalidas` to the `SolicitudMenores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firmaUsoImagenes` to the `SolicitudMenores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacionesSalidas` to the `SolicitudMenores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacionesUsoImagenes` to the `SolicitudMenores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SolicitudMayores" ADD COLUMN     "firmaReglamento" TEXT NOT NULL,
ADD COLUMN     "firmaUsoImagenes" TEXT NOT NULL,
ADD COLUMN     "observacionesUsoImagenes" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SolicitudMenores" ADD COLUMN     "firmaReglamento" TEXT NOT NULL,
ADD COLUMN     "firmaSalidas" TEXT NOT NULL,
ADD COLUMN     "firmaUsoImagenes" TEXT NOT NULL,
ADD COLUMN     "observacionesSalidas" TEXT NOT NULL,
ADD COLUMN     "observacionesUsoImagenes" TEXT NOT NULL;
