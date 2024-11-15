'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// parte de del cronograma de alumno donde se muestra los cursos que tiene el alumno y sus respectivos horarios
// buscar con el id de alumno los cursos que tiene y luego con el id de curso buscar en el cronograma de de ese curso y luego con 
// el id del cronograma buescar los horarios de ese cronogramadiaHora

export async function getCronogramaByIdAlumno(alumnoId: number) {
  try {
    // Obtener los IDs de los cursos asociados al alumno
    const alumnoCursos = await prisma.alumno_Curso.findMany({
      where: {
        alumnoId,
      },
      select: {
        cursoId: true,
      },
    });

    if (alumnoCursos.length === 0) {
      console.log("No se encontraron cursos para el alumno.");
      return [];
    }

    const cursoIds = alumnoCursos.map((ac) => ac.cursoId);
    const fechaActual = new Date();
    //const fechaActual = new Date('2025-06-01'); // Fecha de prueba

    // Buscar cursos vigentes
    const cursosVigentes = await prisma.curso.findMany({
      where: {
        id: { in: cursoIds },
         fechaFin: { gte: fechaActual }, // Vigentes según fecha de fin
      },
    });

    if (cursosVigentes.length === 0) {
      console.log("No se encontraron cursos vigentes.");
      return [];
    }

    // Obtener los cronogramas y sus horarios
    const cronogramasVigentes = await prisma.cronogramaDiaHora.findMany({
      where: {
        cronograma: {
          cursoId: { in: cursosVigentes.map((c) => c.id) },
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

    return cronogramasVigentes;
  } catch (error) {
    console.error("Error al obtener cronogramas:", error);
    throw error;
  }
}
