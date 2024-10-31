"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Responsable = {
    alumnoId: number
    nombre: String
    apellido: String
    dni:number   
    email: string
    telefono: number
    direccionId: number
};

//crear responsable
export async function createResponsable(data: {
  alumnoId: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  telefono: number;
  direccionId: number;
}) {
  return await prisma.responsable.create({
    data: data,
  });
}
//obtener responsable por id
export async function getResponsableById(responsableId: number) {
  return await prisma.responsable.findUnique({
    where: {
      alumnoId: responsableId,
    },
  });
}
