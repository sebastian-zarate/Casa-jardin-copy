/*
  Warnings:

  - A unique constraint covering the columns `[password]` on the table `Profesional` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profesional" ALTER COLUMN "password" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_password_key" ON "Profesional"("password");
