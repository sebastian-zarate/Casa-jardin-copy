-- CreateTable
CREATE TABLE "Profesional" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "Profesional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profesional_Curso" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "profesionalId" INTEGER NOT NULL,

    CONSTRAINT "Profesional_Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "year" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" INTEGER NOT NULL,
    "telefono" INTEGER NOT NULL,
    "direccionId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Alumno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alumno_Curso" (
    "id" SERIAL NOT NULL,
    "alumnoId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "Alumno_Curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagos" (
    "id" SERIAL NOT NULL,
    "Id" INTEGER NOT NULL,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cronograma" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "fechaId" INTEGER NOT NULL,
    "aulaId" INTEGER NOT NULL,

    CONSTRAINT "Cronograma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fecha" (
    "id" SERIAL NOT NULL,
    "dia" TIMESTAMP(3) NOT NULL,
    "hora_inicio" TIMESTAMP(3) NOT NULL,
    "hora_fin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fecha_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_email_key" ON "Profesional"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_telefono_key" ON "Profesional"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_direccionId_key" ON "Profesional"("direccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_Curso_cursoId_key" ON "Profesional_Curso"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_Curso_profesionalId_key" ON "Profesional_Curso"("profesionalId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_dni_key" ON "Alumno"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_telefono_key" ON "Alumno"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_direccionId_key" ON "Alumno"("direccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_email_key" ON "Alumno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_Curso_alumnoId_key" ON "Alumno_Curso"("alumnoId");

-- CreateIndex
CREATE UNIQUE INDEX "Alumno_Curso_cursoId_key" ON "Alumno_Curso"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Pagos_Id_key" ON "Pagos"("Id");

-- CreateIndex
CREATE UNIQUE INDEX "Cronograma_cursoId_key" ON "Cronograma"("cursoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cronograma_fechaId_key" ON "Cronograma"("fechaId");

-- CreateIndex
CREATE UNIQUE INDEX "Cronograma_aulaId_key" ON "Cronograma"("aulaId");

-- AddForeignKey
ALTER TABLE "Profesional" ADD CONSTRAINT "Profesional_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesional_Curso" ADD CONSTRAINT "Profesional_Curso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profesional_Curso" ADD CONSTRAINT "Profesional_Curso_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "Profesional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno_Curso" ADD CONSTRAINT "Alumno_Curso_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "Alumno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alumno_Curso" ADD CONSTRAINT "Alumno_Curso_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_Id_fkey" FOREIGN KEY ("Id") REFERENCES "Alumno_Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cronograma" ADD CONSTRAINT "Cronograma_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cronograma" ADD CONSTRAINT "Cronograma_fechaId_fkey" FOREIGN KEY ("fechaId") REFERENCES "Fecha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cronograma" ADD CONSTRAINT "Cronograma_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
