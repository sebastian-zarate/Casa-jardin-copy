-- DropForeignKey
ALTER TABLE "Alumno" DROP CONSTRAINT "Alumno_direccionId_fkey";

-- AlterTable
ALTER TABLE "Alumno" ALTER COLUMN "dni" DROP NOT NULL,
ALTER COLUMN "telefono" DROP NOT NULL,
ALTER COLUMN "direccionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Alumno" ADD CONSTRAINT "Alumno_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
