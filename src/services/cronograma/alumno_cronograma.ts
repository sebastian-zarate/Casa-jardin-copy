'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// parte de del cronograma de alumno donde se muestra los cursos que tiene el alumno y sus respectivos horarios
// buscar con el id de alumno los cursos que tiene y luego con el id de curso buscar en el cronograma de de ese curso y luego con 
// el id del cronograma buescar los horarios de ese cronogramadiaHora

export async function getCronogramaByIdAlumno(alumnoId: number) {
    try {
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
                aula: true,
  
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