/*
  Warnings:

  - A unique constraint covering the columns `[direccionId]` on the table `Administrador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[direccionId]` on the table `Alumno` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[direccionId]` on the table `Profesional` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CursoSolicitud" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "CursoSolicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudMayores" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "alumnoId" INTEGER NOT NULL,

    CONSTRAINT "SolicitudMayores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudMenores" (
    "id" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "enfermedad" TEXT NOT NULL,
    "alergia" TEXT NOT NULL,
    "medicacion" TEXT NOT NULL,
    "terapia" TEXT NOT NULL,
    "especialista" TEXT NOT NULL,
    "motivoAsistencia" TEXT NOT NULL,
    "responsableId" INTEGER NOT NULL,

    CONSTRAINT "SolicitudMenores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsable" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" INTEGER NOT NULL,
    "telefono" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "Responsable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudMayores_solicitudId_key" ON "SolicitudMayores"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudMenores_solicitudId_key" ON "SolicitudMenores"("solicitudId");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudMenores_responsableId_key" ON "SolicitudMenores"("responsableId");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_alumnoId_key" ON "Responsable"("alumnoId");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_dni_key" ON "Responsable"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_telefono_key" ON "Responsable"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_email_key" ON "Responsable"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Responsable_direccionId_key" ON "Responsable"("direccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_direccionId_key" ON "Administrador"("direccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_direccionId_key" ON "Alumno"("direccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_direccionId_key" ON "Profesional"("direccionId");

-- AddForeignKey
ALTER TABLE "CursoSolicitud" ADD CONSTRAINT "CursoSolicitud_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoSolicitud" ADD CONSTRAINT "CursoSolicitud_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudMayores" ADD CONSTRAINT "SolicitudMayores_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudMayores" ADD CONSTRAINT "SolicitudMayores_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudMenores" ADD CONSTRAINT "SolicitudMenores_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudMenores" ADD CONSTRAINT "SolicitudMenores_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudMenores" ADD CONSTRAINT "SolicitudMenores_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "Responsable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsable" ADD CONSTRAINT "Responsable_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsable" ADD CONSTRAINT "Responsable_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
