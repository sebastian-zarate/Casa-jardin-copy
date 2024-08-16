"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type Curso = {
    id: number
    nombre: string
    year: number
    descripcion: string

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