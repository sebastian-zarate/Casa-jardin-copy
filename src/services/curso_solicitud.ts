"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//crear curso_solicitud
export async function createCursoSolicitud(data: {
  cursoId: number;
  solicitudId: number;
}) {
  if (data.cursoId == null || data.solicitudId == null) {
    return("Faltan datos");
  }
  return await prisma.cursoSolicitud.create({
    data: data,
  });
}

//eliminar curso_solicitud
export async function deleteCursoSolicitud(cursoSolicitudId: number) {
  return await prisma.cursoSolicitud.delete({
    where: {
      id: cursoSolicitudId,
    },
  });
}