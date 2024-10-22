'use server'
import Alumnos from "@/app/Admin/alumnos/page";
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
  let cursos: any = [];  
  alumno_cursos.forEach(async (alumno_curso) => {
    const curso = await prisma.curso.findUnique({
      where: {
        id: alumno_curso.cursoId,
      },
      select: {
        id: true,
        nombre: true,
        year: true,
        descripcion: true,
        imagen: true,
        cronograma: true, // Ensure this property is included in the query
      },
    });
    cursos.push(curso);
  });
  console.log("Se encontró algún curso??????", cursos);
}

// parte de del cronograma de alumno donde se muestra los cursos que tiene el alumno y sus respectivos horarios
// buscar con el id de alumno los cursos que tiene y luego con el id de curso buscar en el cronograma de de ese curso y luego con 
// el id del cronograma buescar los horarios de ese cronogramadiaHora

export async function getCronogramaByIdAlumno(alumnoId: number) {
  try {
    console.log("Buscando cronogramas del alumno con id:", alumnoId);
    // busco el id del alumno y el id del curso
    const alumno = await prisma.alumno_Curso.findMany({
      where: {
        alumnoId: alumnoId,
      },
      select: {
        cursoId: true,
      },
    });
    // busco el cronograma del curso
    
      if (alumno) {
        const cronogramas = [];
        for (const a of alumno) {
          const cronograma = await prisma.cronograma.findMany({
            where: {
              cursoId: a.cursoId,
            },
            select: {
              id: true,
            },
          });
          cronogramas.push(...cronograma);
        }
      } else {
        console.log("No se encontró el alumno");
      }
      // busco los horarios de los cron
 
      const cronogramas = await prisma.cronogramaDiaHora.findMany({
        where: {
          cronograma: {
           cursoId: { in: alumno.map(a => a.cursoId) }, // Filtro por id del aula
          },
        },
        include: {
          cronograma: {
            include: {
              curso: true,
            },
          },
        },
      });
 
      return cronogramas;
    } catch (error) {
      console.error("Error al obtener cronogramas:", error);
      throw error;
    }
  
  

}
