"use server"

import { PrismaClient } from "@prisma/client";
import { deleteSolicitudMayor, getSolicitudMayorByIdSolictud, SolicitudMayor } from "./SolicitudMayor";
import { getSolicitudMenorByIdSolictud, SolicitudMenores } from "./SolicitudMenor";
import { deleteAlumno_Curso } from "../alumno_curso";
import { getAlumnoById } from "../Alumno";
import { getResponsableByAlumnoId } from "../responsable";
import { deleteCursoSolicitud } from "../curso_solicitud";
import { cp } from "fs";

const prisma = new PrismaClient();

export type Solicitud = {
  id: number;
  leida: boolean;
  enEspera:Boolean;
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
  let soliBorrada;
  // Check if the solicitud is a solicitudMayor or solicitudMenor
  solicitud = await getSolicitudMayorByIdSolictud(solicitudId);
  if(!solicitud) {
    solicitud = await getSolicitudMenorByIdSolictud(solicitudId);
    // si es una solicitudMenor, eliminarla
    soliBorrada = await prisma.solicitudMenores.delete({
      where: {
        id: solicitud?.id,
      },
    });
  }
  console.log("SOLICITUD", solicitud);
  // si es una solicitudMayor, eliminarla
  if(solicitud) soliBorrada = await deleteSolicitudMayor(solicitud.id);
  console.log("SOLICITUD BORRADA", soliBorrada);
/*   const idAlumno = solicitud?.alumnoId;
  // Si no se encontró la solicitud
  if(!idAlumno) {
    console.log("No se encontró la solicitud");
    return "No se encontró la solicitud";
  } */
  //elimina la tabla intermedia entre solicitud y curso
  const cur_soli = await deleteCursoSolicitud(Number(solicitud?.id), Number(solicitud?.alumnoId));
  
  if(typeof cur_soli === "string") {
    console.log("No se encontró la tabla intermedia");
    return cur_soli;}
  console.log("CURSO SOLICITUD", cur_soli);
  // Eliminar la tabla intermedia entre alumno y curso


  // Eliminar la solicitud en cascada

  return await prisma.solicitud.delete({
    where: {
      id: solicitud?.id,
    },
  });
}


//modificar solicitud
export async function updateSolicitud(solicitudId: number, data: {
  leida?: boolean;
  enEspera?: boolean;
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

export async function getPersonasSoli(dataMa: SolicitudMayor[], dataMe: SolicitudMenores[]) {
  return await Promise.all([
    Promise.all(dataMa.map(async (solicitMay) => {
        const alumno = await getAlumnoById(solicitMay.alumnoId);
        return alumno;
    })),
    Promise.all(dataMe.map(async (solicitMen) => {
        const alumno = await getAlumnoById(solicitMen.alumnoId);
        return alumno;
    })),
    Promise.all(dataMe.map(async (solicitMen) => {
        const responsable = await getResponsableByAlumnoId(solicitMen.alumnoId);
        return responsable;
    }))

]);
}