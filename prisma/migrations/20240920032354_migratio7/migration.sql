/*
  Warnings:

  - Added the required column `numero` to the `Direccion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Direccion" ADD COLUMN     "numero" INTEGER NOT NULL;
