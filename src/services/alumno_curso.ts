'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Alumno_Curso = {
    id: number;
    alumnoId: number;
    cursoId: number;
}
export async function createAlumno_Curso(data: {
    cursoId: number;
    alumnoId: number;
}) {
  const al_cur = await getalumnos_cursoByIdAlumnoIdCur(data.alumnoId, data.cursoId);
  if (al_cur) {
    return "El alumno ya se encuentra inscripto en el curso";
  }
  return await prisma.alumno_Curso.create({
    data,
  });
}

export async function getalumnos_cursoByIdAlumnoIdCur(alumnoId: number, cursoId:number) {
  return await prisma.alumno_Curso.findFirst({
    where: {
      alumnoId: alumnoId,
      cursoId: cursoId,
    },
  });
}
export async function getalumnos_cursoByIdAlumno(alumnoId: number) {
  return await prisma.alumno_Curso.findMany({
    where: {
      alumnoId: alumnoId,
    },
  });
}

export async function getCursosByIdAlumno(id: number) {
  const alum_cur=  await prisma.alumno_Curso.findMany({
    where: {
      alumnoId: id,
    },
  });
  let arrayCursos: any[] = [];
  for (const pc of alum_cur) {
    const curso = await prisma.curso.findFirst({
      where: {
        id: pc.cursoId,
      },
    });
    arrayCursos.push(curso);
    //console.log("CURSO", curso);
  }
  console.log("CURSO", arrayCursos);
  return arrayCursos;
}

export async function deleteAlumno_Curso(idAlumno: number, idCurso: number) {
  const al_cur = await getalumnos_cursoByIdAlumnoIdCur(idAlumno, idCurso);
  if (!al_cur) {
    console.log("El alumno no está inscripto en el curso");
    return "El alumno no está inscripto en el curso";
  }
  return await prisma.alumno_Curso.delete({
    where: { id: al_cur.id },
  });
}