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
  let bol = 1; // variable para verificar si el curso ya esta asignado a esa hora y dia en otra aula
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
      bol = 0;
      break;
    }
  }

  // Si existe el conflicto, retornamos un error
  if (existe) {
    return {
      error: `El curso ya está asignado a la misma hora y día en otra aula.`,
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
  return bol;
}




// si el curso ya esta asignado a esa hora y dia
export async function getCursosByAula(aula: number) {
  const cursos = await prisma.cronograma.findMany({
    where: { aulaId: aula },
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
}

export async function getCronogramaDiaHora(dias: number, horas: number) {

  const cronogramaDiaHora = await prisma.cronogramaDiaHora.findFirst({
    where: {
      diaId: dias,
      horaId: horas,
    },
  });

  return cronogramaDiaHora?.id || null;
}

// obtener los cursos de la base de datos que ya estan asignados a un aula y dia y hora

export async function getAllCronogramas(aula: number) { // Obtener todos los cronogramas segun el aula
  const cronogramas = await prisma.cronograma.findMany({
    where: {
      aulaId: 2,
    },
    include: {
      curso: true,
      diasHoras: {
        include: {
          dia: true,
          hora: true,
        },
      },
    },
  });
}
export const getCronogramas = async () => {
  try {
    // hacer la consulta en la base de datos de cronogrmaDIahora
    const cronogramas = await prisma.cronogramaDiaHora.findMany({
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

// obtener en base a el aula 
export const getCronogramasPorAula = async (id_aula: number) => {
  try {
    // Hacer la consulta en la base de datos con el filtro por aula
    const cronogramas = await prisma.cronogramaDiaHora.findMany({
      where: {
        cronograma: {
          aulaId: id_aula, // Filtro por id del aula
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

  // Buscar el id  cronogramadiahora a eliminar
  const cronogramaDiaHora = await prisma.cronogramaDiaHora.findUnique({ // Buscar el cronograma con el ID proporcionado
    where: {
      cronogramaId_diaId_horaId: {
        cronogramaId: (await prisma.cronograma.findFirst({
          where: { aulaId: idAula },
        }))?.id!,
        diaId: id_dia,
        horaId: id_hora ,
      },
    },
  });
 console.log(cronogramaDiaHora?.id);
  try {
    // Elimina el cronograma con el ID proporcionado
    const result = await prisma.cronogramaDiaHora.delete({
      where: {
        id: Number(cronogramaDiaHora?.id),
      },
    });
    return result; // Opcional: retorna el resultado de la operación

  }
  catch (error) {
    console.error(`Error eliminando cronograma con ID ${cronogramaDiaHora?.id}:`, error);
  }
}



