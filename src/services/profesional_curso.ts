'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type Profesional_Curso = {
    id: number;
    profesionalId: number;
    cursoId: number;
}
export async function createProfesional_Curso(data: { cursoId: number, profesionalId: number }) {
      // Check if a record with the same cursoId already exists
      const prof_cur = await getProfesional_CursoById_curso_prof(data.cursoId, data.profesionalId);
      if(prof_cur) return "El profesional ya se encuentra inscripto en el curso";
      
      // Check if the cursoId exists
      const cursoExists = await prisma.curso.findUnique({
          where: { id: data.cursoId },
      });
      if (!cursoExists) return "El curso no existe";

      // Proceed with creating the new record
      const newRecord = await prisma.profesional_Curso.create({
          data: {
              cursoId: data.cursoId,
              profesionalId: data.profesionalId,
          },
      });

      return newRecord;
}

export async function getProfesional_CursoById_curso_prof(cursoId: number, profesionalId: number){
  return await prisma.profesional_Curso.findFirst({
    where: {
      cursoId: cursoId,
      profesionalId: profesionalId,
    },
  });
}

// Get all profesionales_cursos
export async function getProfesionales_CursoByIdProf(profesionalId: number) {
  return await prisma.profesional_Curso.findMany({
    where: {
      profesionalId: profesionalId,
    },
  });
}
export async function getCursosByIdProfesional(profesionalId: number) {
  const prof_cur=  await prisma.profesional_Curso.findMany({
    where: {
      profesionalId: profesionalId,
    },
  });
  let arrayCursos: any[] = [];
  for (const pc of prof_cur) {
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