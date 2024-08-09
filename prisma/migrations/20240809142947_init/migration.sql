-- CreateTable
CREATE TABLE "Nacionalidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Nacionalidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localidad" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" SERIAL NOT NULL,
    "localidadId" INTEGER NOT NULL,
    "provinciaId" INTEGER NOT NULL,
    "nacionalidadId" INTEGER NOT NULL,

    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Direccion_localidadId_key" ON "Direccion"("localidadId");

-- CreateIndex
CREATE UNIQUE INDEX "Direccion_provinciaId_key" ON "Direccion"("provinciaId");

-- CreateIndex
CREATE UNIQUE INDEX "Direccion_nacionalidadId_key" ON "Direccion"("nacionalidadId");

-- AddForeignKey
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_nacionalidadId_fkey" FOREIGN KEY ("nacionalidadId") REFERENCES "Nacionalidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Direccion" ADD CONSTRAINT "Direccion_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
