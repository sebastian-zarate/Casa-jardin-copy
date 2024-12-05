"use server"

import { PrismaClient } from "@prisma/client";
import { get } from "http";
import { getalumnos_cursoByIdAlumnoIdCur } from "./alumno_curso";

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
export async function getCursoSolicitudBySoliId( idSoli: number) {
  const curs_soli = await prisma.cursoSolicitud.findMany({
    where: {
      solicitudId: idSoli,
    },
  });
  if (!curs_soli) {
    return("No se encontró el cursoSolicitud");
  }
  return curs_soli;
}

//eliminar curso_solicitud
export async function deleteCursoSolicitud(soliId: number, idAlumno: number) {
  const cursoSolicitud = await prisma.cursoSolicitud.findMany({
    where: {
      solicitudId: soliId,
      },
  });
  console.log("CURSO_SOLICITUD", cursoSolicitud);
/*   cursoSolicitud.map(async (cs) => {
    const alumnoCurso = await getalumnos_cursoByIdAlumnoIdCur(idAlumno, cs.cursoId);
    const a_c = await prisma.alumno_Curso.delete({
      where: {
        id: alumnoCurso?.id,
      },
    });
    console.log("ALUMNO_CURSO", a_c);
  }); */
  if (!cursoSolicitud) {
    return("Record to delete does not exist");
  }

  return await prisma.cursoSolicitud.deleteMany({
    where: {
      solicitudId: soliId,
    },
  });
}