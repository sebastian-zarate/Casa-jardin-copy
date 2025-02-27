"use server"

import { getUserFromCookie } from "@/helpers/jwt"
import { PrismaClient } from "@prisma/client"
import { getAllProfesionales_cursos } from "./profesional_curso"
import { getAllAlumnos_cursos } from "./alumno_curso"

const prisma = new PrismaClient()
export type Curso = {
    id: number
    nombre: string
    descripcion: string
    edadMinima: number
    edadMaxima: number
    fechaInicio: Date
    fechaFin: Date
    imagen: string | null
  }
//Crear Crusos
export async function createCurso(data: {
    nombre: string
    descripcion: string
    edadMinima: number
    edadMaxima: number
    fechaInicio: Date
    fechaFin: Date
    imagen: string | null
}) {
    // antes de crear un curso se verifica si el curso ya existe en la base de datos con el nombre que se quiere crear y año
    const curso = await getCursoByNombre(data) 
    // si el curso ya existe se devuelve un error
    if (curso) {
        return "El talller ya existe con esos datos"
    }
    // Crear un nuevo curso con los datos que se pasan en el objeto data
    return prisma.curso.create({
        data: {
            nombre: data.nombre,
            descripcion: data.descripcion,
            edadMaxima: Number(data.edadMaxima),
            edadMinima: Number(data.edadMinima),
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            imagen: data.imagen
        }
    })
}


//
// Obtener un curso por nombre 
export async function getCursoByNombre(data: { 
    nombre: string, 
    fechaFin: Date, 
    fechaInicio: Date, 
    edadMaxima: number, 
    edadMinima: number 
  }) {
      return prisma.curso.findFirst({
          where: {
              nombre: data.nombre,
              fechaFin: data.fechaFin,
              fechaInicio: data.fechaInicio,
              edadMaxima: Number(data.edadMaxima),
              edadMinima: Number(data.edadMinima)
          }
      });
  }
  
 
//Listar Crusos
export async function getCursos() {
    return prisma.curso.findMany()
}


//Obtener un Curso por ID
export async function getCursoById(id: number) {
    return prisma.curso.findUnique({
        where: {
            id
        }
    })
}

//Eliminar Curso
// Se elimina un curso por su id, se verifica si el curso tiene un cronograma asignado
// si no tiene un cronograma asignado se elimina el curso, si tiene un cronograma asignado busca ese id de cronograma en la tabla de cronogramaDiaHora  
// si encuentra un cronogramaDiaHora con ese id de cronograma asignado al curso, no se puede eliminar el curso
// si no encuentra un cronogramaDiaHora con ese id de cronograma asignado al curso, se elimina el cronograma asignado al curso y luego se elimina el curso
export async function deleteCurso(id: number): Promise<{ success: boolean, message: string }> {

    try {
        // Verificar si el curso tiene un cronograma asignado
        const cronograma = await prisma.cronograma.findFirst({

            where: {
                cursoId: id
            }
        })
        // busco que que el curso no tenga un profesor asignado para poder eliminarlo si tiene un profesor asignado no se puede eliminar
        // muestra un mensaje de error
        const profesor_curso = await prisma.profesional_Curso.findFirst({
            where: {
                cursoId: id
            }
        })
        if (profesor_curso) {
            return { success: false, message: "El Curso seleccionado tiene un profesor asignado y no puede ser eliminado." };    
        }
        // si el curso tiene un alumno asignado no se puede eliminar y muestra un mensaje de error
        const alumno_curso = await prisma.alumno_Curso.findFirst({
            where: {
                cursoId: id
            }
        })
        if (alumno_curso) {
            return { success: false, message: "El Curso seleccionado tiene un alumno asignado y no puede ser eliminado." };    
        }
       
        if (cronograma) {
            // Verificar si el cronograma tiene un cronogramaDiaHora asignado
            const cronogramaDiaHora = await prisma.cronogramaDiaHora.findFirst({
                where: {
                    cronogramaId: cronograma.id
                }
            })
            if (cronogramaDiaHora) {
                return { success: false, message: "El Curso seleccionado está asignado a un horario y no puede ser eliminado." };
            } else {
                // Eliminar el cronograma asignado al curso
                await prisma.cronograma.delete({
                    where: {
                        id: cronograma.id
                    }
                })
            }
        }
        if (profesor_curso) {
            return { success: false, message: "El Curso seleccionado tiene un profesor asignado y no puede ser eliminado." };
        }
        if (alumno_curso) {
            return { success: false, message: "El Curso seleccionado tiene un alumno asignado y no puede ser eliminado." };
        }
        // SI EL curso tiene una solicitud de inscripcion no se puede eliminar
        const solicitud = await prisma.cursoSolicitud.findFirst({
            where: {
                cursoId: id
            }
        })
        if (solicitud) {
            return { success: false, message: "El Curso seleccionado tiene una solicitud de inscripción y no puede ser eliminado." };
        }
        

        // Eliminar el curso
        await prisma.curso.delete({
            where: {
                id
            }
        })
        // Si todo fue exitoso, devolver success con true
        return { success: true, message: "Curso eliminado con éxito." };

    } catch (error) {

        return { success: false, message: "Error al eliminar el curso. Vuelve a intentarlo más tarde!" };
    }
}




//Actualizar un Curso, pasando el id, para actualizar un curso en especifico
// y modifico sus datos con los datos que se pasan en el objeto data
export async function updateCurso(id: number, data: {
    nombre: string
    descripcion: string
    fechaInicio: Date
    fechaFin: Date
    edadMinima: number
    edadMaxima: number
    imagen: string | null
  
}) {
    return prisma.curso.update({
        where: {
            id
        },
        data: {
            nombre: data.nombre,
            descripcion: data.descripcion,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            edadMaxima: Number(data.edadMaxima),
            edadMinima: Number(data.edadMinima),
            imagen: data.imagen
        }
    })
}

//get cursos en base a la edad del usuario
//se muestran los cursos en los que la edad del user es mayor o igual a la edad minima del curso y menor o igual a la edad maxima del curso
//y se muestran si la fecha actual esta entre la fecha de inicio y fin del curso
export async function getCursosByEdad(edad: number) {
    const fechaHoy = new Date()
    return await prisma.curso.findMany({
        where: {
            edadMinima: {
                lte: edad
            },
            edadMaxima: {
                gte: edad
            },
            fechaInicio: {
                lte: fechaHoy
            },
            fechaFin: {
                gte: fechaHoy
            }
        }
    })
}

export async function getCantCursosActivos() {
    const fechaHoy = new Date();
    const cursosActivos = await prisma.curso.count({
        where: {
            fechaFin: {
                gte: fechaHoy
            }
        }
    });
    return cursosActivos;
}
// obtener los cursos que actualmente estan activos

export async function getCursosActivos(){
    const cursos = await getCursos();
    const fechaHoy = new Date();
    return cursos.filter(curso => curso.fechaInicio <= fechaHoy && curso.fechaFin >= fechaHoy);
}


// Obtener cursos en los que está inscrito un usuario
export async function getCursosInscriptos(userId: number) {
    const fechaHoy = new Date();
    // Obtener los cursos en los que está inscrito el usuario
    const cursosInscriptos = await prisma.alumno_Curso.findMany({
        where: {
            alumnoId: userId, // Usar el ID del usuario para filtrar
        },
        include: {
            curso: true, // Incluir la información del curso
        },
    });

    // Filtrar los cursos activos en la fecha actual
    return cursosInscriptos
        .map((inscripcion) => inscripcion.curso) // Extraer los datos del curso
        .filter((curso) => curso.fechaInicio <= fechaHoy && curso.fechaFin >= fechaHoy);
}

export async function getCursosDisponiblesAlumno(edad: number, alumnoId: number){
    const fechaHoy = new Date()
    return await prisma.curso.findMany({
        where: {
            edadMinima: {
                lte: edad
            },
            edadMaxima: {
                gte: edad
            },
            fechaInicio: {
                lte: fechaHoy
            },
            fechaFin: {
                gte: fechaHoy
            },
            // para que no se muestren los cursos en los que el alumno ya esta inscripto
            alum_cur: {
                none: {
                    alumnoId
                }
            }
            //despues hay que agregar que no muestre los que ya le creo una solicitud
        }
    })
}


// Listar Cursos
/**
 * Obtiene una lista de cursos con la cantidad de alumnos inscritos en cada curso.
 * @returns {Promise<Array>} Una lista de cursos con sus datos y cantidad de alumnos.
 */
export async function getCursosCout() {
    try {
        // Consultar cursos junto con la cantidad de alumnos inscritos
        const cursos = await prisma.curso.findMany({
            include: {
                _count: {
                    select: { alum_cur: true } // Relación que cuenta los alumnos inscritos
                }
            }
        });

        // Mapear los resultados para estructurar la respuesta
        return cursos.map(curso => ({
            id: curso.id,
            nombre: curso.nombre,
            descripcion: curso.descripcion,
            edadMinima: curso.edadMinima,
            edadMaxima: curso.edadMaxima,
            fechaInicio: curso.fechaInicio,
            fechaFin: curso.fechaFin,
            imagen: curso.imagen,
            cantidadAlumnos: curso._count.alum_cur // Usar camelCase para claves
        }));
    } catch (error) {
        console.error("Error al obtener los cursos:", error);
        throw new Error("No se pudieron obtener los cursos.");
    }
}

