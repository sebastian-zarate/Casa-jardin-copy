"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type SolicitudMayor = {
  id: number;
  alumnoId: number;
  solicitudId: number;
  firmaUsoImagenes: string | null;
  observacionesUsoImagenes: string | null;
  firmaReglamento: string | null;
};
//crear solicitudMayor
export async function createSolicitudMayor(data: {
  alumnoId: number;
  solicitudId: number;
  firmaUsoImagenes: string;
  observacionesUsoImagenes: string;
  firmaReglamento: string;
}) {
  return await prisma.solicitudMayores.create({
    data: {
      alumnoId: data.alumnoId,
      solicitudId: data.solicitudId,
      firmaUsoImagenes: data.firmaUsoImagenes,
      observacionesUsoImagenes: data.observacionesUsoImagenes,
      firmaReglamento: data.firmaReglamento,
    },
  });
}
//obtener solicitudMayor por id de solicitud 
export async function getSolicitudMayorByIdSolictud(solicitudId: number) {
  const x =  await prisma.solicitudMayores.findFirst({
    where: {
      solicitudId: solicitudId,
    },
  });
  return x;
}

//obtener todas las solicitudesMayores
export async function getAllSolicitudesMayores() {
  return await prisma.solicitudMayores.findMany();
}

//eliminar solicitudMayor
export async function deleteSolicitudMayor(solicitudId: number) {
  return await prisma.solicitudMayores.delete({
    where: {
      solicitudId: solicitudId,
    },
  });
}