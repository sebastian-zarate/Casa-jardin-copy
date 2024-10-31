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
//obtener alumno_curso por id
export async function getalumnos_cursoByIdAlumno(alumnoId: number) {
  return await prisma.alumno_Curso.findMany({
    where: {
      alumnoId: alumnoId,
    },
  });
}
//eliminar alumno_curso
export async function deleteAlumno_Curso(alumno_cursoId: number) {
  return await prisma.alumno_Curso.delete({
    where: {
      id: alumno_cursoId,
    },
  });
}
//obtener todos los alumnos_curso
export async function getcursosByIdAlumno( alumnoId: number) {
  const alumno_cursos = await prisma.alumno_Curso.findMany({
    where: {
      alumnoId: alumnoId,
    },
  });
  let cursos: any = [];  
  alumno_cursos.forEach(async (alumno_curso) => {
    const curso = await prisma.curso.findUnique({
      where: {
        id: alumno_curso.cursoId,
      },
    });
    cursos.push(curso);
  });
  console.log("Se encontró algún curso??????", cursos);
}