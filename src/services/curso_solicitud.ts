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

//eliminar curso_solicitud
export async function deleteCursoSolicitud(cursoSolicitudId: number, idAlumno: number) {
  const cursoSolicitud = await prisma.cursoSolicitud.findMany({
    where: {
      solicitudId: cursoSolicitudId,
    },
  });
  console.log("CURSO_SOLICITUD", cursoSolicitud);
  cursoSolicitud.map(async (cs) => {
    const alumnoCurso = await getalumnos_cursoByIdAlumnoIdCur(idAlumno, cs.cursoId);
    const a_c = await prisma.alumno_Curso.delete({
      where: {
        id: alumnoCurso?.id,
      },
    });
    console.log("ALUMNO_CURSO", a_c);
  });
  if (!cursoSolicitud) {
    return("Record to delete does not exist");
  }

  return await prisma.cursoSolicitud.deleteMany({
    where: {
      solicitudId: cursoSolicitudId,
    },
  });
}