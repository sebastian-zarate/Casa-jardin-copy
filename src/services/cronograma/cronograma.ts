"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


// Crea un nuevo cronograma
export async function createCronograma(data: {
  id_aula: number;
  id_curso: number;
  diasHoras: { id_dia: number; id_hora: number }[];
}) {
  let existe = false;

  // Verificar si el curso ya está asignado en la misma hora y día en otra aula
  for (const diaHora of data.diasHoras) {
    const cursoAsignado = await prisma.cronogramaDiaHora.findFirst({
      where: {
        diaId: diaHora.id_dia,
        horaId: diaHora.id_hora,
        cronograma: {
          cursoId: data.id_curso,
          aulaId: {
            not: data.id_aula, // El aula debe ser diferente
          },
        },
      },
    });

    // Si ya está asignado en otra aula, marcamos que existe y rompemos el ciclo
    if (cursoAsignado) {
      existe = true;
      break;
    }
  }

  // Si existe el conflicto, retornamos un error
  if (existe) {
    return {
      error: `El curso seleccionado ya está asignado a la misma hora y día en otra aula.`, // Mensaje de error personalizado
    };
  }

  // Buscar si ya existe un cronograma para este aula y curso
  let cronogramaId: number;
  const cronogramaExistente = await prisma.cronograma.findFirst({
    where: {
      aulaId: data.id_aula,
      cursoId: data.id_curso,
      
    },
  });

  if (cronogramaExistente) {
    // Usar el cronograma existente
    cronogramaId = cronogramaExistente.id;
  } else {
    // Crear un nuevo cronograma si no existe
    const nuevoCronograma = await prisma.cronograma.create({
      data: {
        aulaId: data.id_aula,
        cursoId: data.id_curso,
      },
    });
    cronogramaId = nuevoCronograma.id;
  }

  // Crear las relaciones de días y horas si no existen
  for (const diaHora of data.diasHoras) {
    const diaHoraExistente = await prisma.cronogramaDiaHora.findFirst({
      where: {
        diaId: diaHora.id_dia,
        horaId: diaHora.id_hora,
        cronogramaId: cronogramaId,
      },
    });

    if (!diaHoraExistente) {
      await prisma.cronogramaDiaHora.create({
        data: {
          diaId: diaHora.id_dia,
          horaId: diaHora.id_hora,
          cronogramaId: cronogramaId,
        },
      });
    }
  }

  // Retornamos el ID del cronograma creado o actualizado
  return { cronogramaId };
}




// si el curso ya esta asignado a esa hora y dia
export async function getCursosByAula(aula: number) {
  try {
    // Obtener la fecha actual
    const fechaActual = new Date();
   
    const cursos = await prisma.cronograma.findMany({
      where: {
        aulaId: aula,
        curso: {
          fechaFin: {
            gte: fechaActual, // Filtrar cursos cuya fecha de fin sea mayor o igual a la fecha actual
          },
        },
      },
      include: {
        curso: true, // Incluye los detalles del curso
        diasHoras: {
          include: {
            dia: true,
            hora: true,
          },
        },
      },
    });

    return cursos;
  } catch (error) {
    console.error("Error al obtener los cursos por aula:", error);
    throw error;
  }
}




// obtener en base a el aula 
export const getCronogramasPorAula = async (id_aula: number) => {
  try {
    // Obtener la fecha actual
    const fechaActual = new Date();

    // Hacer la consulta en la base de datos con el filtro por aula
    const cronogramas = await prisma.cronogramaDiaHora.findMany({
      where: {
        cronograma: {
          aulaId: id_aula, // Filtro por id del aula
          curso: {
            fechaFin: {
              gte: fechaActual, // Filtra los cursos cuya fechaFin sea mayor o igual a la fecha actual
            },
          },
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
};



// comparar si el curso ya esta asignado a esa hora y dia en otra aula 
// si es asi que me diga que ya esta asignado a esa hora y dia en otra aula
// si es verdadero que me diga que ya esta asignado a esa hora y dia en otra aula
export async function getCursosByDiaHora(dia: number, hora: number) {
  const cursos = await prisma.cronogramaDiaHora.findMany({
    where: {
      diaId: dia,
      horaId: hora,
    },
    include: {
      cronograma: {
        include: {
          aula: true,
          curso: true,
        },
      },
    },
  });

  return cursos;
}

// eliminar todos los cronogramas de un aula   en tabla cronogramaDiaHora
// Eliminar todos los cronogramas de un aula  
export async function deleteCronogramas(aula: number) {
  try {
    // Elimina todos los cronogramas donde el aula coincide con el ID proporcionado
    const result = await prisma.cronogramaDiaHora.deleteMany({
      where: {
        cronograma: {
          aulaId: aula,
        },
      },
    });
    return result; // Opcional: retorna el resultado de la operación
  } catch (error) {
    console.error(`Error eliminando cronogramas para el aula ${aula}:`, error);

  }
}

// verificar si el curso ya esta asignado a esa hora y dia en otra aula para poder asignarlo a otra 
// si es falso que me permita asignar el curso a esa hora y dia en esa aula
// si es verdadero que me diga que ya esta asignado a esa hora y dia en otra aula
// Verificar si el curso ya está asignado a esa hora y día en otra aula
export async function getCursosByDiaHoraAula(dia: number, hora: number, cursoId: number) {
  // Obtiene todos los cursos asignados en el día y la hora específicos
  const cursos = await prisma.cronogramaDiaHora.findMany({
    where: {
      diaId: dia,
      horaId: hora,
    },
    include: {
      cronograma: {
        include: {
          aula: true,
          curso: true,
        },
      },
    },
  });

  // Verificar si el curso ya está asignado
  const cursoAsignado = cursos.some(cronograma => cronograma.cronograma.cursoId === cursoId);

  if (cursoAsignado) {
    return {
      asignado: true,
    };
  } else {
    return {
      asignado: false,
      message: `El curso puede ser asignado a esa hora y día en la aula seleccionada.`,
    };
  }
}



//eliminar un cronograma de la base de datos pasando el id del de cronogramadiahora

export async function deleteCronogramaDiaHora(idAula: number, id_dia: number, id_hora: number) {
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

    // Si se encuentra, eliminar el cronogramaDiaHora
    const result = await prisma.cronogramaDiaHora.delete({
      where: { id: cronogramaDiaHora.id },
    });

   // console.log(`El cronograma con ID ${cronogramaDiaHora.id} ha sido eliminado.`);
    return { success: `El cronograma del aula con ID ${idAula}, día ${id_dia} y hora ${id_hora} ha sido eliminado exitosamente.` };

  } catch (error) {
   // console.error('Error eliminando el cronogramaDiaHora:', error);
    return { error: 'Ocurrió un error eliminando el cronograma.' };
  }
}

// creo otro getcursos para poder obtener los cursos de la base de datos en base a la fecha de fin  sea mayor a la fecha actual
export async function getCursosCronograma() {
  const fechaActual = new Date();
  const cursos = await prisma.curso.findMany({
    where: {
      fechaFin: {
        gte: fechaActual,
      },
    },
  });

  return cursos;
}