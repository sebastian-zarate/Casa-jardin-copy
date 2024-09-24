/*
  Warnings:

  - Added the required column `password` to the `Profesional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profesional" ADD COLUMN     "password" INTEGER NOT NULL;
