"use server"
import { PrismaClient } from "@prisma/client"
import { get } from "http"
const prisma = new PrismaClient()
// funcion para crear una aula con los datos que se pasan en el objeto data que seria por el numero de aula

export async function createAula(data: {
    nombre: string,
}) {
    return prisma.aula.create({
        data
    })
}
// funcion para obtener todas las aulas

export async function getAulas() {
    return prisma.aula.findMany()
}

// funcion para obtener un aula por su id
export async function getAulaById(id: number) {
    return prisma.aula.findUnique({
        where: {
            id
        }
    })
}

export async function getAulaByNombre(nombre1: string) { // comprobar si el nombre del aula ya existe
    const nombreAulas = await getAulas()
    for (let i = 0; i < nombreAulas.length; i++) {
        if (nombreAulas[i].nombre === nombre1) {
            return true
        }else{
            return false
        }
    }
}

// funcion para eliminar un aula por su id

export async function deleteAulas(id: number) {
    return prisma.aula.delete({
        where: {
            id
        }
    })
}
