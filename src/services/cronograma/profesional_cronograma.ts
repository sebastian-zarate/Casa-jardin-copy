'use server'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// con el id de profesional buscar los cursos que tiene asignados
// y luego con el id de curso buscar los cronogramas de ese curso
// y luego con el id del cronograma buscar los horarios de ese cronogramadiaHora


export async function getCronogramaByIdProfesional(profesionalId: number) {
  const fechaActual = new Date(); // Definir la fecha actual para la comparación
    try {
      const prof_cur = await prisma.profesional_Curso.findMany({
        where: {
          profesionalId: profesionalId,
          // busco que la fecha de fin del curso sea mayor o igual a la fecha actual
          curso: {
            fechaFin: {
              gte: fechaActual,
            },
          },
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

// con el id de del profesional buscar los cursos que tiene asignados
export async function getCursosByIdProfesional(profesionalId: number) {
  try {
    const fechaActual = new Date(); // Definir la fecha actual para la comparación

    const prof_cur = await prisma.profesional_Curso.findMany({
      where: {
        profesionalId: profesionalId,
        curso: {
          fechaFin: {
            gte: fechaActual, // Filtrar cursos con fechaFin mayor o igual a la fecha actual
          },
        },
      },
      include: {
        curso: true, // Incluye toda la información del curso relacionado
      },
    });

    // Transforma los resultados para devolver solo los datos necesarios
    return prof_cur.map((profCur) => ({
      id: profCur.curso.id,
      nombre: profCur.curso.nombre,
      cursoId: profCur.cursoId,
      profesionalId: profCur.profesionalId,
      fechaFin: profCur.curso.fechaFin, // Incluye otros campos necesarios si aplica
    }));
  } catch (error) {
    console.error("Error al obtener los cursos por profesional:", error);
    throw new Error("No se pudieron obtener los cursos"); // Lanza un error para manejarlo en niveles superiores
  }
}


// Para modificar los cursos asignados a un profesional se necesita el id del profesional para buscar los cursos que tiene asignados

export async function getCursosConProfesional() {
  const fechaActual = new Date();

  const cursos = await prisma.curso.findMany({
    where: {
      fechaFin: {
        gte: fechaActual, // Solo cursos activos
      },
    },
   // traeme el id del  profesional asignado a ese curso
    include: {
      prof_cur: {
        select: {
          profesionalId: true,
          
        },
      },
    },
  });
  
  // retorna los cursos con el id del profesional asignado
  return cursos;
}



// eliminar un cronograma por id de cronograma
export async function deleteCronogramaDiaHoraProfesional(idAula: number, id_dia: number, id_hora: number, id_profesional: number) {
  try {
    // Buscar el cronogramaDiaHora correspondiente al aula, día y hora
    const cronogramaDiaHora = await prisma.cronogramaDiaHora.findFirst({
      where: {
        diaId: id_dia,
        horaId: id_hora,
        cronograma: {
          aulaId: idAula,
        },
      },
    });

    // Si no se encuentra el cronogramaDiaHora, retornar un error
    if (!cronogramaDiaHora) {
      return { error: `No se encontró el cronograma para el aula con ID ${idAula}, día ${id_dia}, y hora ${id_hora}.` };
    }

    // Verificar si el profesional está asignado al curso
    const verificarProfesional = await prisma.cronograma.findFirst({
      where: {
        id: cronogramaDiaHora.cronogramaId,
        curso: {
          prof_cur: {
            some: {
              profesionalId: id_profesional,
            },
          },
        },
      },
    });

    // Si el profesional está asignado al curso, no se puede eliminar
    if (verificarProfesional) {
        await prisma.cronogramaDiaHora.delete({
        where: { id: cronogramaDiaHora.id },
      });
     
    }
    else {
       return { success: `No tienes permiso para eliminar este curso.` };

      }
    
  

  } catch (error) {
    return { error: 'Ocurrió un error eliminando el cronograma.' };
  }
}
