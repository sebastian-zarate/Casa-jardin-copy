'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// con el id de profesional buscar los cursos que tiene asignados
// y luego con el id de curso buscar los cronogramas de ese curso
// y luego con el id del cronograma buscar los horarios de ese cronogramadiaHora
export async function getCronogramaByIdProfesional(profesionalId: number) {
    try {
      const prof_cur = await prisma.profesional_Curso.findMany({
        where: {
          profesionalId: profesionalId,
        },
      });
      const cronogramas = [];
      for (const pc of prof_cur) {
        const cronograma = await prisma.cronograma.findMany({
          where: {
            cursoId: pc.cursoId,
          },
          select: {
            id: true,
          },
        });
        cronogramas.push(...cronograma);
      }
      const cronogramasDiaHora = await prisma.cronogramaDiaHora.findMany({
        where: {
          cronograma: {
            id: { in: cronogramas.map((c) => c.id) }, // Filter by aula id
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
  
      return cronogramasDiaHora;
    } catch (error) {
      console.error("Error al obtener cronogramas:", error);
      throw error;
    }
  }


  