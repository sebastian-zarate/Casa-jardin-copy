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
  return await prisma.alumno_Curso.create({
    data,
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
    console.log("CURSO", curso);
  }
  return arrayCursos;
}
export async function deleteAlumno_Curso(id: number) {
  return await prisma.alumno_Curso.delete({
    where: { id },
  });
}