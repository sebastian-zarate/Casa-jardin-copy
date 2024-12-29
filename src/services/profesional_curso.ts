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
  console.log("PROF_CUR", prof_cur);
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
  console.log("CURSOS", arrayCursos);
  return arrayCursos;
}
export async function getAllProfesionales_cursos() {
  return await prisma.alumno_Curso.findMany();
}
export async function getCantProfesionalesActivos() {
  const prof_Curso = await getAllProfesionales_cursos();
  const uniqueProfesionales = Array.from(new Set(prof_Curso.map(prof_Curs => prof_Curs.alumnoId)));
  const cantProf = uniqueProfesionales.length;
  return   cantProf
  
}

//devuelve una lista de profesionales que estan a cargo de un curso
export async function getProfesionalesByCursoId(cursoId: number) {
  const prof_cur = await prisma.profesional_Curso.findMany({
    where: {
      cursoId: cursoId,
    },
  });
  let arrayProfesionales: any[] = [];
  for (const pc of prof_cur) {
    const profesional = await prisma.profesional.findFirst({
      where: {
        id: pc.profesionalId,
      },
    });
    if (profesional) {
      arrayProfesionales.push(profesional);
    }
  }
  return arrayProfesionales;
}