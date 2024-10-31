"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//las solicitudes tienen solamente el campo de id
export async function getSolicitudes() {
  return await prisma.solicitud.findMany({});
}

export async function getSolicitudById(id: number) {
  return await prisma.solicitud.findUnique({
    where: {
      id: id,
    },
  });
}

export async function createSolicitud() {
  return await prisma.solicitud.create({
    //data siempre va a ser vacio
    data: {},
  });
}
