"use server"

import { getUserFromCookie } from "@/helpers/jwt"
import { PrismaClient } from "@prisma/client"
import { error } from "console"

const prisma = new PrismaClient()
export type Curso = {
    id: number;
    nombre: string;
    year: number;
    descripcion: string;
  }
//Crear Crusos
export async function createCurso(data: {
    nombre: string
    year: number
    descripcion: string
}) {
    return prisma.curso.create({
        data
    })
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
export async function deleteCurso(id: number) {
    try {
        // Verificar si el curso tiene un cronograma asignado
       const cronograma = await prisma.cronograma.findFirst({

            where: {
                cursoId: id
            }
        })
        if (cronograma) {
            // Verificar si el cronograma tiene un cronogramaDiaHora asignado
            const cronogramaDiaHora = await prisma.cronogramaDiaHora.findFirst({
                where: {
                    cronogramaId: cronograma.id
                }
            })
            if (cronogramaDiaHora) {
                return "No se puede eliminar el curso, tiene un horario asignado"
            } else {
                // Eliminar el cronograma asignado al curso
                await prisma.cronograma.delete({
                    where: {
                        id: cronograma.id
                    }
                })
            }
        }
        // Eliminar el curso
        return prisma.curso.delete({
            where: {
                id
            }
        })

    } catch (error) {
        
        return error;
    }
}


//Actualizar un Curso, pasando el id, para actualizar un curso en especifico
// y modifico sus datos con los datos que se pasan en el objeto data
export async function updateCurso(id: number, data: {
    nombre: string
    year: number
    descripcion: string
}) {
    return prisma.curso.update({
        where: {
            id
        },
        data
    })
}

