"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//cursoSoliccitud es la tabla media entre las solicitudes y los cursos

export async function getCursoSolicitud() {
  return await prisma.cursoSolicitud.findMany({});
}

export async function getCursoSolicitudById(id: number) {
  return await prisma.cursoSolicitud.findUnique({
    where: {
      id: id,
    },
  });
}
//retorna los cursos de una solicitud
export async function getCursoSolicitudBySolicitudId(solicitudId: number) {
  return await prisma.cursoSolicitud.findMany({
    where: {
      solicitudId: solicitudId,
    },
  });
}

export async function createCursoSolicitud(data: {
  solicitudId: number;
  cursoId: number;
}) {
  return await prisma.cursoSolicitud.create({
    data: data,
  });
}

export async function updateCursoSolicitud(id: number, data: any) {
  return await prisma.cursoSolicitud.update({
    where: { id },
    data: data,
  });
}

export async function deleteCursoSolicitud(id: number) {
  return await prisma.cursoSolicitud.delete({
    where: { id },
  });
}
