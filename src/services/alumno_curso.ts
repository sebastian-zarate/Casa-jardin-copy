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

export async function getcursosByIdAlumno( alumnoId: number) {
  const alumno_cursos = await prisma.alumno_Curso.findMany({
    where: {
      alumnoId: alumnoId,
    },
  });

  const cursos = alumno_cursos.map(x => x.cursoId);
  console.log("2Se encontró algún curso??????", alumno_cursos);
  return cursos;
}
export async function deleteAlumno_Curso(id: number) {
  return await prisma.alumno_Curso.delete({
    where: { id },
  });
}