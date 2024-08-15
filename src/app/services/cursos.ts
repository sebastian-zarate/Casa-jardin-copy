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