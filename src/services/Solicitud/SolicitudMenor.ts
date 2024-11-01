"use server"

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type SolicitudMenores = {
  id: number;
  solicitudId: number;
  alumnoId: number;
  enfermedad: string;
  alergia: string;
  medicacion: string;
  terapia: string;
  especialista: string;
  motivoAsistencia: string;
  firmaUsoImagenes: string;
  observacionesUsoImagenes: string;
  firmaSalidas: string;
  observacionesSalidas: string;
  firmaReglamento: string;
};

//obtener solicitudMayor por id de solicitud 
export async function getSolicitudMenorByIdSolictud(solicitudId: number) {
  const x =  await prisma.solicitudMenores.findFirst({
    where: {
      solicitudId: solicitudId,
    },
  });
  return x;
}
//obtener todas las solicitudesMenores
export async function getAllSolicitudesMenores() {
  return await prisma.solicitudMenores.findMany();
}

//las solicitudes para alumnos menores de edad
export async function getSolicitudesMenores() {
  return await prisma.solicitudMenores.findMany({});
}

export async function getSolicitudMenoresById(id: number) {
  return await prisma.solicitudMenores.findUnique({
    where: {
      id: id,
    },
  });
}



export async function getSolicitudesMenoresByAlumnoId(alumnoId: number) {
  return await prisma.solicitudMenores.findMany({
    where: {
      alumnoId: alumnoId,
    },
  });
}

export async function createSolicitudMenores(data: {
  solicitudId: number;
  alumnoId: number;
  enfermedad: string;
  alergia: string;
  medicacion: string;
  terapia: string;
  especialista: string;
  motivoAsistencia: string;
  //firmas
  firmaUsoImagenes: string;
  observacionesUsoImagenes: string;
  firmaSalidas: string;
  observacionesSalidas: string;
  firmaReglamento: string;
}) {
  return await prisma.solicitudMenores.create({
    data: data,
  });
}

export async function updateSolicitudMenores(id: number, data: any) {
  return await prisma.solicitudMenores.update({
    where: { id },
    data: data,
  });
}

export async function deleteSolicitudMenores(id: number) {
  return await prisma.solicitudMenores.delete({
    where: { id },
  });
}
