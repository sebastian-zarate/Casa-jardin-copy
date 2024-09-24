/*
  Warnings:

  - A unique constraint covering the columns `[rolId]` on the table `Alumno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rolId]` on the table `Profesional` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rolId` to the `Alumno` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rolId` to the `Profesional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alumno" ADD COLUMN     "rolId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profesional" ADD COLUMN     "rolId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Administrador" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "direccionId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_email_key" ON "Administrador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_rolId_key" ON "Administrador"("rolId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_rolId_key" ON "Alumno"("rolId");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_rolId_key" ON "Profesional"("rolId");

-- AddForeignKey
ALTER TABLE "Administrador" ADD CONSTRAINT "Administrador_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrador" ADD CONSTRAINT "Administrador_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
