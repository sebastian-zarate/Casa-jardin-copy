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
