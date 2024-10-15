/*
  Warnings:

  - You are about to drop the column `numero` on the `Aula` table. All the data in the column will be lost.
  - You are about to drop the column `fechaId` on the `Cronograma` table. All the data in the column will be lost.
  - You are about to drop the `Fecha` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nombre` to the `Aula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cronograma" DROP CONSTRAINT "Cronograma_fechaId_fkey";

-- DropIndex
DROP INDEX "Cronograma_aulaId_key";

-- DropIndex
DROP INDEX "Cronograma_cursoId_key";

-- DropIndex
DROP INDEX "Cronograma_fechaId_key";

-- AlterTable
ALTER TABLE "Aula" DROP COLUMN "numero",
ADD COLUMN     "nombre" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cronograma" DROP COLUMN "fechaId";

-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "imagen" TEXT;

-- DropTable
DROP TABLE "Fecha";

-- CreateTable
CREATE TABLE "Dia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Dia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CronogramaDiaHora" (
    "id" SERIAL NOT NULL,
    "cronogramaId" INTEGER NOT NULL,
    "diaId" INTEGER NOT NULL,
    "horaId" INTEGER NOT NULL,

    CONSTRAINT "CronogramaDiaHora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hora" (
    "id" SERIAL NOT NULL,
    "hora_inicio" TEXT NOT NULL,

    CONSTRAINT "Hora_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronogramaDiaHora_cronogramaId_diaId_horaId_key" ON "CronogramaDiaHora"("cronogramaId", "diaId", "horaId");

-- AddForeignKey
ALTER TABLE "CronogramaDiaHora" ADD CONSTRAINT "CronogramaDiaHora_cronogramaId_fkey" FOREIGN KEY ("cronogramaId") REFERENCES "Cronograma"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CronogramaDiaHora" ADD CONSTRAINT "CronogramaDiaHora_diaId_fkey" FOREIGN KEY ("diaId") REFERENCES "Dia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CronogramaDiaHora" ADD CONSTRAINT "CronogramaDiaHora_horaId_fkey" FOREIGN KEY ("horaId") REFERENCES "Hora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
