"use server"

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Crear Alumnos
export async function createRol(data: {
    nombre: string;

}) {
  return await prisma.rol.create({
    data: data,
  });
}

// Actualizar Alumnos
export async function getRoles() {
    return await prisma.rol.findMany();
}

// Obtener Alumno por ID
export async function getRolById(id: number) {
    return await prisma.rol.findUnique({
        where: {
            id: id
        }
    });
}
