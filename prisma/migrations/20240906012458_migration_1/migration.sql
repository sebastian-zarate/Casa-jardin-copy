/*
  Warnings:

  - You are about to alter the column `telefono` on the `Alumno` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Alumno" ALTER COLUMN "telefono" SET DATA TYPE INTEGER;
