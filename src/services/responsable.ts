"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//get responsable by alumno ID

export async function getResponsableByAlumnoId(alumnoId: number) {
  return await prisma.responsable.findUnique({
    where: {
      alumnoId: alumnoId,
    },
  });
}

//crear responsable
export async function createResponsable(data: {
  alumnoId: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: number;
  email: string;
  direccionId: number;
}) {
  return await prisma.responsable.create({
    data: data,
  });
}

//actualizar responsable
export async function updateResponsable(id: number, data: any) {
  return await prisma.responsable.update({
    where: { id },
    data: data,
  });
}

//eliminar responsable
export async function deleteResponsable(id: number) {
  return await prisma.responsable.delete({
    where: { id },
  });
}
