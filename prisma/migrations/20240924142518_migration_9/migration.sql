/*
  Warnings:

  - A unique constraint covering the columns `[direccionId]` on the table `Profesional` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profesional_direccionId_key" ON "Profesional"("direccionId");
