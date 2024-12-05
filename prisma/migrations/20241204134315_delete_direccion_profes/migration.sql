/*
  Warnings:

  - You are about to drop the column `direccionId` on the `Profesional` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profesional" DROP CONSTRAINT "Profesional_direccionId_fkey";

-- AlterTable
ALTER TABLE "Profesional" DROP COLUMN "direccionId";
