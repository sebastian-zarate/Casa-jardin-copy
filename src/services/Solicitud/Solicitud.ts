"use server"

import { PrismaClient } from "@prisma/client";
import { deleteSolicitudMayor, getSolicitudMayorByIdSolictud, SolicitudMayor } from "./SolicitudMayor";
import { getSolicitudMenorByIdSolictud } from "./SolicitudMenor";
import { deleteAlumno_Curso } from "../alumno_curso";

const prisma = new PrismaClient();

export type Solicitud = {
  id: number;
  leida: boolean;
};
//crear solicitud
export async function createSolicitud() {
  return await prisma.solicitud.create({});
}
//obtener solicitud por id
export async function getSolicitudById(solicitudId: number) {
  return await prisma.solicitud.findUnique({
    where: {
      id: solicitudId,
    },
  });
}
//obtener todas las solicitudes
export async function getSolicitudes() {
  return await prisma.solicitud.findMany();
}

//eliminar solicitud
export async function deleteSolicitud(solicitudId: number) {
  let solicitud; 
  // Check if the solicitud is a solicitudMayor or solicitudMenor
  solicitud = await getSolicitudMayorByIdSolictud(solicitudId);
  if(!solicitud) {
    solicitud = await getSolicitudMenorByIdSolictud(solicitudId);
    // si es una solicitudMenor, eliminarla
    await prisma.solicitudMenores.delete({
      where: {
        solicitudId: solicitudId,
      },
    });
  }
  // si es una solicitudMayor, eliminarla
  await deleteSolicitudMayor(solicitudId);
  const idAlumno = solicitud?.alumnoId;
  // Si no se encontró la solicitud
  if(!idAlumno) return "No se encontró la solicitud";
  // Eliminar la tabla intermedia entre alumno y curso
  await deleteAlumno_Curso(idAlumno);

  // Eliminar la solicitud en cascada
  return await prisma.solicitud.delete({
    where: {
      id: solicitudId,
    },
  });
}

//modificar solicitud
export async function updateSolicitud(solicitudId: number, data: {
  leida?: boolean;
}) {
  return await prisma.solicitud.update({
    where: {
      id: solicitudId,
    },
    data: data,
  });
}

//obtener todas las solicitudes
export async function getAllSolicitudes() {
  return await prisma.solicitud.findMany();
}