'use server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

// trae el todos los dias de la semana en orden por id
export async function getDias() {
    return prisma.dia.findMany({
        orderBy: {
            id: 'asc'
        }
    })
}

  // trae el trae todas las horas en orden por id
export async function getHoras() {
    return prisma.hora.findMany({
        orderBy: {
            id: 'asc'
        }
    })
}